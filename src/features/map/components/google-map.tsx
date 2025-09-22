import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { GoogleMapsProvider, Status } from "@/shared/components/google-maps-provider";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ClientLocation, MapConfig } from "../types";
import { DEFAULT_MAP_CONFIG } from "../types";
import { ClientModal } from "./client-modal";

type GoogleMapProps = {
  clients: ClientLocation[];
  selectedClientId?: string;
  config?: Partial<MapConfig>;
  className?: string;
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Constants
const SELECTED_CLIENT_ZOOM = 15;
const MARKER_SIZE = 40;
const MARKER_ANCHOR_X = 20;
const MARKER_ANCHOR_Y = 40;

const MapComponent = ({
  clients,
  selectedClientId,
  config = {},
  onClientSelect,
}: GoogleMapProps & { onClientSelect: (client: ClientLocation) => void }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const mapConfig = { ...DEFAULT_MAP_CONFIG, ...config };

  // Filtrar clientes si se especifica un ID
  const filteredClients = selectedClientId ? clients.filter((client) => client.id === selectedClientId) : clients;

  // Ajustar centro del mapa si hay un cliente seleccionado
  const mapCenter =
    selectedClientId && filteredClients.length > 0
      ? { lat: filteredClients[0].latitude, lng: filteredClients[0].longitude }
      : mapConfig.center;

  const createMarkerForClient = useCallback(
    (client: ClientLocation, map: google.maps.Map, bounds: google.maps.LatLngBounds) => {
      const marker = new window.google.maps.Marker({
        position: { lat: client.latitude, lng: client.longitude },
        map,
        title: client.name,
        icon: {
          url:
            client.status === "active"
              ? 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2322c55e"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E'
              : 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b7280"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E',
          scaledSize: new window.google.maps.Size(MARKER_SIZE, MARKER_SIZE),
          anchor: new window.google.maps.Point(MARKER_ANCHOR_X, MARKER_ANCHOR_Y),
        },
      });

      markersRef.current.push(marker);
      const markerPosition = marker.getPosition();
      if (markerPosition) {
        bounds.extend(markerPosition);
      }

      // Agregar evento click al marcador
      marker.addListener("click", () => {
        onClientSelect(client);
      });

      return marker;
    },
    [onClientSelect]
  );

  const initializeMap = useCallback(() => {
    if (!mapRef.current) {
      return;
    }
    if (!window.google) {
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: selectedClientId ? SELECTED_CLIENT_ZOOM : mapConfig.zoom,
      mapTypeId: mapConfig.mapTypeId as google.maps.MapTypeId,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // Limpiar marcadores existentes
    for (const marker of markersRef.current) {
      marker.setMap(null);
    }
    markersRef.current = [];

    // Crear marcadores para cada cliente
    const bounds = new window.google.maps.LatLngBounds();

    for (const client of filteredClients) {
      createMarkerForClient(client, map, bounds);
    }

    // Ajustar vista para mostrar todos los marcadores
    if (filteredClients.length > 1) {
      map.fitBounds(bounds);
    }
  }, [filteredClients, mapCenter, mapConfig.zoom, mapConfig.mapTypeId, selectedClientId, createMarkerForClient]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  return <div className="h-full w-full" ref={mapRef} />;
};

const LoadingComponent = ({ className }: { className?: string }) => (
  <Card className={`flex items-center justify-center p-8 ${className}`}>
    <div className="flex items-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="text-muted-foreground">Cargando mapa...</span>
    </div>
  </Card>
);

const ErrorComponent = ({ error, className }: { error: Error; className?: string }) => (
  <Card className={`flex items-center justify-center p-8 ${className}`}>
    <Alert className="max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>Error cargando Google Maps: {error.message}</AlertDescription>
    </Alert>
  </Card>
);

const RenderMap = ({ status, className, ...props }: GoogleMapProps & { status: Status }) => {
  const [selectedClient, setSelectedClient] = useState<ClientLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClientSelect = (client: ClientLocation) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  if (status === Status.LOADING) {
    return <LoadingComponent className={className} />;
  }

  if (status === Status.FAILURE) {
    return <ErrorComponent className={className} error={new Error("Failed to load Google Maps")} />;
  }

  return (
    <>
      <MapComponent {...props} onClientSelect={handleClientSelect} />
      <ClientModal client={selectedClient} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export const GoogleMap = ({ clients, selectedClientId, config, className }: GoogleMapProps) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Card className={`flex items-center justify-center p-8 ${className}`}>
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Google Maps API key no configurada. Agrega VITE_GOOGLE_MAPS_API_KEY a tu archivo .env
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <GoogleMapsProvider>
      {(status: Status) => (
        <RenderMap
          className={className}
          clients={clients}
          config={config}
          selectedClientId={selectedClientId}
          status={status}
        />
      )}
    </GoogleMapsProvider>
  );
};

// Exportación por defecto adicional
export default GoogleMap;
