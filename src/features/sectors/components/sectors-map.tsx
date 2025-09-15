import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Sector, SectorMapData } from "../types";

type SectorsMapProps = {
  sectors: Sector[];
  selectedSector?: Sector | null;
  onSectorSearch?: (sectorName: string, placeData: google.maps.places.PlaceResult) => void;
  className?: string;
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: 6.5244, lng: 3.3792 }; // Lagos, Nigeria
const DEFAULT_ZOOM = 12;
const FOCUSED_ZOOM = 14;
const SECTOR_RADIUS = 2000; // 2km radius

const MapComponent = ({ sectors, selectedSector, onSectorSearch }: SectorsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const sectorsDataRef = useRef<SectorMapData[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const renderSectors = useCallback(
    (map: google.maps.Map) => {
      // Limpiar sectores anteriores
      for (const sectorData of sectorsDataRef.current) {
        if (sectorData.polygon) {
          sectorData.polygon.setMap(null);
        }
      }
      sectorsDataRef.current = [];

      // Crear polígonos para cada sector
      for (const sector of sectors) {
        // Para demostración, crear un círculo como polígono
        // En una implementación real, usarías las coordenadas reales del sector
        const circle = new window.google.maps.Circle({
          strokeColor: sector.color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: sector.color,
          fillOpacity: 0.2,
          map,
          center: DEFAULT_CENTER,
          radius: SECTOR_RADIUS,
        });

        // InfoWindow para mostrar información del sector
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
          <div style="padding: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${sector.color};"></div>
              <strong>${sector.nombre}</strong>
            </div>
            <p style="margin: 0; color: #666; font-size: 12px;">ID: ${sector.id}</p>
          </div>
        `,
        });

        circle.addListener("click", () => {
          infoWindow.setPosition(circle.getCenter());
          infoWindow.open(map);
        });

        sectorsDataRef.current.push({
          ...sector,
          polygon: circle as unknown as google.maps.Polygon,
        });
      }
    },
    [sectors]
  );

  const initializeMap = useCallback(() => {
    if (!mapRef.current) {
      return;
    }
    if (!window.google) {
      return;
    }

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

    mapInstanceRef.current = map;

    // Inicializar Places Autocomplete
    if (searchInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        types: ["sublocality", "political"],
        componentRestrictions: { country: "ng" }, // Restringir a Nigeria
      });

      autocomplete.bindTo("bounds", map);
      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          map.setCenter(place.geometry.location);
          map.setZoom(FOCUSED_ZOOM);

          // Callback para crear sector desde búsqueda
          if (onSectorSearch && place.name) {
            onSectorSearch(place.name, place);
          }
        }
      });
    }

    // Renderizar sectores existentes
    renderSectors(map);
  }, [renderSectors, onSectorSearch]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }
    if (!mapInstanceRef.current) {
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    const request = {
      query: searchQuery,
      fields: ["name", "geometry", "place_id"],
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
        const place = results[0];
        if (place.geometry?.location) {
          mapInstanceRef.current?.setCenter(place.geometry.location);
          mapInstanceRef.current?.setZoom(FOCUSED_ZOOM);

          if (onSectorSearch && place.name) {
            onSectorSearch(place.name, place);
          }
        }
      }
    });
  };

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  // Enfocar sector seleccionado
  useEffect(() => {
    if (selectedSector && mapInstanceRef.current) {
      // En una implementación real, enfocarías las coordenadas del sector
      mapInstanceRef.current.setCenter(DEFAULT_CENTER);
      mapInstanceRef.current.setZoom(FOCUSED_ZOOM);
    }
  }, [selectedSector]);

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Buscar sector o área (ej: Victoria Island, Ikeja...)"
            ref={searchInputRef}
            value={searchQuery}
          />
        </div>
        <Button onClick={handleSearch}>Buscar</Button>
      </div>

      {/* Mapa */}
      <div className="h-96 overflow-hidden rounded-lg" ref={mapRef} />
    </div>
  );
};

const SectorsMap = ({ sectors, selectedSector, onSectorSearch, className }: SectorsMapProps) => {
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

    return <MapComponent onSectorSearch={onSectorSearch} sectors={sectors} selectedSector={selectedSector} />;
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
      <Wrapper apiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]} render={renderMap} />
    </div>
  );
};

export { SectorsMap };
