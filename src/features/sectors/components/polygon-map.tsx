import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMapsProvider, Status } from "@/shared/components/google-maps-provider";
import { AlertCircle, Loader2, MapPin, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GeometryData } from "../types";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: 8.7832, lng: -75.8782 }; // Tocache, Peru
const DEFAULT_ZOOM = 14;
const MAP_INIT_DELAY_MS = 100;

type PolygonMapProps = {
  onPolygonComplete?: (geometry: GeometryData | null) => void;
  initialGeometry?: GeometryData | null;
  sectorColor?: string;
  className?: string;
};

/**
 * Convierte un polígono de Google Maps a formato GeoJSON
 */
const polygonToGeoJSON = (polygon: google.maps.Polygon): GeometryData => {
  const path = polygon.getPath();
  const coordinates: number[][] = [];

  for (let i = 0; i < path.getLength(); i++) {
    const vertex = path.getAt(i);
    coordinates.push([vertex.lng(), vertex.lat()]);
  }

  // Cerrar el polígono (primer punto = último punto)
  if (coordinates.length > 0) {
    coordinates.push(coordinates[0]);
  }

  return {
    type: "Polygon",
    coordinates: [coordinates],
  };
};

/**
 * Convierte GeoJSON a polígono de Google Maps
 */
const geoJSONToPolygon = (geometry: GeometryData, map: google.maps.Map, color = "#3b82f6"): google.maps.Polygon => {
  const coordinates = geometry.coordinates[0];
  const path: google.maps.LatLng[] = [];

  for (const coord of coordinates) {
    path.push(new window.google.maps.LatLng(coord[1], coord[0])); // lat, lng
  }

  return new window.google.maps.Polygon({
    paths: path,
    map,
    fillColor: color,
    fillOpacity: 0.3,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    editable: true,
    draggable: false,
  });
};

export const PolygonMap = ({
  onPolygonComplete,
  initialGeometry,
  sectorColor = "#3b82f6",
  className,
}: PolygonMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const currentPolygonRef = useRef<google.maps.Polygon | null>(null);

  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [hasPolygon, setHasPolygon] = useState(false);

  // Limpiar polígono actual
  const clearPolygon = useCallback(() => {
    if (currentPolygonRef.current) {
      currentPolygonRef.current.setMap(null);
      currentPolygonRef.current = null;
      setHasPolygon(false);
      onPolygonComplete?.(null);
    }
  }, [onPolygonComplete]);

  // Manejar finalización de polígono
  const handlePolygonComplete = useCallback(
    (polygon: google.maps.Polygon) => {
      // Limpiar polígono anterior si existe
      if (currentPolygonRef.current) {
        currentPolygonRef.current.setMap(null);
      }

      // Configurar nuevo polígono
      polygon.setOptions({
        fillColor: sectorColor,
        fillOpacity: 0.3,
        strokeColor: sectorColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        editable: true,
        draggable: false,
      });

      currentPolygonRef.current = polygon;
      setHasPolygon(true);
      setIsDrawingMode(false);

      // Convertir a GeoJSON y notificar
      const geometry = polygonToGeoJSON(polygon);
      onPolygonComplete?.(geometry);

      // Escuchar cambios en el polígono
      const updateGeometry = () => {
        const updatedGeometry = polygonToGeoJSON(polygon);
        onPolygonComplete?.(updatedGeometry);
      };

      polygon.getPath().addListener("set_at", updateGeometry);
      polygon.getPath().addListener("insert_at", updateGeometry);
      polygon.getPath().addListener("remove_at", updateGeometry);

      // Desactivar modo de dibujo
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
    },
    [sectorColor, onPolygonComplete]
  );

  // Activar modo de dibujo
  const startDrawing = useCallback(() => {
    if (drawingManagerRef.current) {
      setIsDrawingMode(true);
      drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    }
  }, []);

  // Inicializar mapa
  const initializeMap = useCallback(() => {
    if (mapInstanceRef.current || !mapRef.current || !window.google) {
      return;
    }

    console.log("Inicializando mapa para crear polígonos...");

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      // Inicializar Drawing Manager
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
          fillColor: sectorColor,
          fillOpacity: 0.3,
          strokeColor: sectorColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          editable: true,
          draggable: false,
        },
      });

      drawingManager.setMap(map);

      // Escuchar eventos de polígono completado
      drawingManager.addListener("polygoncomplete", handlePolygonComplete);

      mapInstanceRef.current = map;
      drawingManagerRef.current = drawingManager;

      // Cargar polígono inicial si existe
      if (initialGeometry) {
        const polygon = geoJSONToPolygon(initialGeometry, map, sectorColor);
        currentPolygonRef.current = polygon;
        setHasPolygon(true);

        // Ajustar vista al polígono
        const bounds = new window.google.maps.LatLngBounds();
        for (const coord of polygon.getPath().getArray()) {
          bounds.extend(coord);
        }
        map.fitBounds(bounds);
      }

      console.log("Mapa y Drawing Manager inicializados correctamente");
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
    }
  }, [sectorColor, initialGeometry, handlePolygonComplete]);

  useEffect(() => {
    if (mapRef.current && window.google && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [initializeMap]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (currentPolygonRef.current) {
        currentPolygonRef.current.setMap(null);
      }
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
    };
  }, []);

  const renderMap = (status: Status) => {
    if (status === Status.FAILURE) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error al cargar Google Maps. Verifica la clave de API.</AlertDescription>
        </Alert>
      );
    }

    if (status === Status.LOADING) {
      return (
        <Card className="flex h-96 items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cargando mapa...</span>
          </div>
        </Card>
      );
    }

    // Inicializar el mapa una vez que Google Maps esté cargado
    setTimeout(() => {
      if (window.google && mapRef.current && !mapInstanceRef.current) {
        initializeMap();
      }
    }, MAP_INIT_DELAY_MS);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Definir Área del Sector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controles del mapa */}
          <div className="flex gap-2">
            <Button
              disabled={isDrawingMode}
              onClick={startDrawing}
              size="sm"
              variant={isDrawingMode ? "secondary" : "default"}
            >
              <MapPin className="mr-2 h-4 w-4" />
              {isDrawingMode ? "Dibujando..." : "Dibujar Polígono"}
            </Button>

            {hasPolygon && (
              <Button onClick={clearPolygon} size="sm" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Borrar Polígono
              </Button>
            )}
          </div>

          {/* Instrucciones */}
          <div className="text-muted-foreground text-sm">
            {(() => {
              if (isDrawingMode) {
                return "Haz clic en el mapa para marcar los puntos del polígono. Haz clic en el primer punto para cerrar.";
              }
              if (hasPolygon) {
                return "Polígono creado. Puedes editarlo arrastrando los puntos o crear uno nuevo.";
              }
              return "Haz clic en 'Dibujar Polígono' y marca los puntos en el mapa para definir el área del sector.";
            })()}
          </div>

          {/* Contenedor del mapa */}
          <div className="h-96 w-full rounded-lg border" ref={mapRef} style={{ backgroundColor: "#f5f5f5" }} />
        </CardContent>
      </Card>
    );
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Google Maps API key no configurada. Configura VITE_GOOGLE_MAPS_API_KEY en tu archivo .env
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      <GoogleMapsProvider>{renderMap}</GoogleMapsProvider>
    </div>
  );
};
