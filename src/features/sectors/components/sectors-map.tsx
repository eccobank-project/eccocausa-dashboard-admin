import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { supabase } from "@/shared/lib/supabase";
import { MapComponent } from "./map-component";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: 8.7832, lng: -75.8782 };
const DEFAULT_ZOOM = 12;
const SINGLE_MARKER_ZOOM = 15;
const POLL_INTERVAL_MS = 500;
const MAX_WAIT_ATTEMPTS = 10;
const MAP_INIT_DELAY_MS = 100;

type RpcClientResponseItem = {
  id: string;
  nombre: string;
  cliente_nombre?: string;
  latitud: number;
  longitud: number;
  sector_nombre?: string;
};

type ClientData = {
  id: string;
  nombre: string;
  cliente_nombre?: string;
  latitud: number;
  longitud: number;
  sector_nombre?: string;
  // Campos derivados para compatibilidad con Google Maps
  lat: number;
  lng: number;
};

type SectorsMapProps = {
  className?: string;
};

type FilterType = "none" | "assigned" | "unassigned";

const SectorsMap = ({ className }: SectorsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const clientMarkersRef = useRef<google.maps.Marker[]>([]);

  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("none");
  const [clientsData, setClientsData] = useState<{
    assigned: ClientData[];
    unassigned: ClientData[];
  }>({
    assigned: [],
    unassigned: [],
  });

  // Crear marcador para cliente
  const createClientMarker = useCallback((client: ClientData, map: google.maps.Map, isAssigned: boolean) => {
    const COORD_DECIMAL_PLACES = 6;

    // Usar lat/lng derivados para compatibilidad o latitud/longitud originales
    const lat = Number(client.lat || client.latitud || 0);
    const lng = Number(client.lng || client.longitud || 0);

    console.log(`🔨 Creando marcador para ${client.nombre}: lat=${lat}, lng=${lng}`);
    console.log("📋 Datos completos del cliente:", client);
    console.log("🗺️ Estado del mapa:", {
      map: !!map,
      mapInstance: !!mapInstanceRef.current,
    });

    // Verificar que las coordenadas sean válidas (no NaN, y no ambas cero)
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      console.error(`Coordenadas NaN para cliente ${client.nombre} (ID: ${client.id})`);
      return null;
    }

    // Permitir coordenadas que no sean exactamente cero (menos estricto)
    if (lat === 0 && lng === 0) {
      console.warn(`Cliente ${client.nombre} tiene coordenadas en (0,0), será omitido`);
      return null;
    }

    try {
      // Crear marcador tradicional directamente (sin intentar marcadores avanzados)
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: client.nombre,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: isAssigned ? "#22c55e" : "#f59e0b",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      console.log("✅ Marcador tradicional creado para", client.nombre, "en posición", lat, lng);
      console.log("🔍 Estado del marcador:", {
        visible: marker.getVisible(),
        map: !!marker.getMap(),
        position: marker.getPosition()?.toJSON(),
        title: marker.getTitle(),
      });

      // InfoWindow para mostrar información del cliente
      const infoContent = `
          <div style="padding: 8px; font-family: system-ui; max-width: 200px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${
                isAssigned ? "#22c55e" : "#f59e0b"
              }; border: 2px solid #fff;"></div>
              <strong style="color: #333; font-size: 14px;">${client.nombre}</strong>
            </div>
            <p style="margin: 2px 0; color: #666; font-size: 11px;">ID: ${client.id}</p>
            <p style="margin: 2px 0; color: ${isAssigned ? "#16a34a" : "#d97706"}; font-size: 11px; font-weight: 500;">
              ${isAssigned ? "Cliente Asignado" : "Cliente No Asignado"}
            </p>
            ${
              client.sector_nombre
                ? `<p style="margin: 2px 0; color: #666; font-size: 11px;">Sector: ${client.sector_nombre}</p>`
                : ""
            }
            <p style="margin: 2px 0; color: #666; font-size: 11px;">Coordenadas: ${lat.toFixed(
              COORD_DECIMAL_PLACES
            )}, ${lng.toFixed(COORD_DECIMAL_PLACES)}</p>
          </div>
        `;

      try {
        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent,
        });

        // Añadir evento click al marcador tradicional
        marker.addListener("click", () => {
          infoWindow.open({
            anchor: marker,
            map,
          });
        });

        return marker;
      } catch (error) {
        console.error("Error al crear InfoWindow:", error);
        return marker;
      }
    } catch (error) {
      console.error(`Error al crear marcador para cliente ${client.nombre}:`, error);
      return null;
    }
  }, []);

  // Limpiar marcadores anteriores
  const clearMarkers = useCallback(() => {
    for (const marker of clientMarkersRef.current) {
      marker.setMap(null);
    }
    clientMarkersRef.current = [];
    console.log("Marcadores limpiados correctamente");
  }, []);

  // Test function to create a visible marker at map center (for debugging)
  const createTestMarker = useCallback(() => {
    if (!mapInstanceRef.current) {
      console.log("No map instance available for test marker");
      return;
    }

    const center = mapInstanceRef.current.getCenter();
    if (!center) {
      console.log("Could not get map center for test marker");
      return;
    }

    const testMarker = new window.google.maps.Marker({
      position: center,
      map: mapInstanceRef.current,
      title: "Test Marker",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      visible: true,
      clickable: true,
    });

    console.log("Test marker created at:", center.toJSON());

    // Add to markers array so it gets cleaned up
    clientMarkersRef.current.push(testMarker);
  }, []);

  // Function to manually refresh and redraw all markers
  const refreshMarkers = useCallback(() => {
    console.log("Refreshing all markers...");
    clientMarkersRef.current.forEach((marker, index) => {
      marker.setVisible(false);
      setTimeout(() => {
        marker.setVisible(true);
        console.log(`Marker ${index + 1} refreshed`);
      }, 50 * index);
    });
  }, []);

  // Renderizar marcadores de clientes
  const renderClientMarkers = useCallback(
    (clients: ClientData[], isAssigned: boolean) => {
      if (!mapInstanceRef.current) {
        console.error("No se puede renderizar marcadores: el mapa no está inicializado");
        return;
      }

      clearMarkers();
      console.log(`Renderizando ${clients.length} marcadores de clientes ${isAssigned ? "asignados" : "no asignados"}`);
      console.log("Datos de clientes recibidos:", clients);

      const bounds = new window.google.maps.LatLngBounds();
      let validMarkers = 0;
      let hasValidCoordinates = false;

      for (const client of clients) {
        const marker = createClientMarker(client, mapInstanceRef.current, isAssigned);
        if (marker) {
          clientMarkersRef.current.push(marker);
          validMarkers++;

          // Force marker visibility and properties
          marker.setVisible(true);
          marker.setClickable(true);
          marker.setDraggable(false);

          console.log(`Marcador creado para ${client.nombre}:`, {
            position: marker.getPosition()?.toJSON(),
            visible: marker.getVisible(),
            clickable: marker.getClickable(),
            map: !!marker.getMap(),
          });

          // Añadir al bounds para ajustar el zoom
          const lat = Number(client.lat || client.latitud || 0);
          const lng = Number(client.lng || client.longitud || 0);
          if (lat !== 0 || lng !== 0) {
            bounds.extend(new window.google.maps.LatLng(lat, lng));
            hasValidCoordinates = true;
          }
        } else {
          console.error(`No se pudo crear marcador para cliente: ${client.nombre}`);
        }
      }

      console.log(`Se crearon ${validMarkers} marcadores válidos de ${clients.length} clientes`);

      // Force map refresh to ensure markers are visible
      if (mapInstanceRef.current && validMarkers > 0) {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            window.google.maps.event.trigger(mapInstanceRef.current, "resize");
            console.log("Mapa re-renderizado para forzar visibilidad de marcadores");
          }
        }, 100);
      }

      // Ajustar el zoom del mapa para mostrar todos los marcadores
      if (hasValidCoordinates && validMarkers > 0) {
        if (validMarkers === 1) {
          // Si solo hay un marcador, centrar en él con zoom fijo
          const lat = Number(clients[0].lat || clients[0].latitud || 0);
          const lng = Number(clients[0].lng || clients[0].longitud || 0);
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(SINGLE_MARKER_ZOOM);
          console.log(`Centrando mapa en único marcador: ${lat}, ${lng}`);
        } else {
          // Si hay múltiples marcadores, ajustar para mostrar todos
          mapInstanceRef.current.fitBounds(bounds);
          console.log(`Ajustando mapa para mostrar ${validMarkers} marcadores`);
        }
      } else {
        console.warn("No se encontraron coordenadas válidas, manteniendo vista actual del mapa");
      }
    },
    [createClientMarker, clearMarkers]
  );

  // Cargar clientes asignados
  const loadAssignedClients = useCallback(async () => {
    setLoading(true);

    // Verificar que el mapa esté inicializado
    if (!mapInstanceRef.current) {
      console.log("Esperando a que el mapa se inicialice antes de cargar clientes asignados...");

      // Esperar hasta que el mapa se inicialice
      let attempts = 0;

      while (!mapInstanceRef.current && attempts < MAX_WAIT_ATTEMPTS) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }

      if (!mapInstanceRef.current) {
        console.error("No se pudo inicializar el mapa después de varios intentos");
        alert("Error al cargar el mapa. Por favor, recarga la página.");
        setLoading(false);
        return;
      }

      console.log("Mapa inicializado correctamente, continuando con la carga de clientes asignados");
    }

    try {
      const { data, error } = await supabase.rpc("mostrar_clientes_asignados");

      if (error) {
        console.error("Error obteniendo clientes asignados:", error);
        alert("Error al cargar clientes asignados");
        return;
      }

      console.log("Datos originales recibidos (asignados):", data);
      console.log(`Número de clientes asignados recibidos: ${data?.length || 0}`);

      // Mapear correctamente usando latitud y longitud (nombres en español)
      const clients = (data || []).map((item: RpcClientResponseItem, index: number) => {
        console.log(`Procesando cliente ${index + 1}:`, item);

        // Verificar los valores recibidos
        if (!(item.latitud && item.longitud)) {
          console.warn(`Cliente ${index} sin coordenadas válidas:`, item);
        }

        // Asegurarnos de que id es un string
        const idString = item.id?.toString() || index.toString();

        const client = {
          // Preservar los campos originales
          ...item,
          // Sobrescribir id con versión string si es necesario
          id: idString,
          // Asegurarnos de tener un nombre para mostrar
          nombre: item.cliente_nombre || item.nombre || `Cliente ${index + 1}`,
          // Preservar nombres originales en español
          latitud: Number(item.latitud) || 0,
          longitud: Number(item.longitud) || 0,
          // Añadir formato compatible con Google Maps
          lat: Number(item.latitud) || 0,
          lng: Number(item.longitud) || 0,
        };

        return client;
      });

      console.log("Clientes asignados procesados:", clients);

      setClientsData((prev) => ({ ...prev, assigned: clients }));
      setActiveFilter("assigned");
      renderClientMarkers(clients, true);

      console.log("Clientes asignados cargados:", clients);
    } catch (error) {
      console.error("Error ejecutando RPC mostrar_clientes_asignados:", error);
      alert("Error de conexión con la base de datos");
    } finally {
      setLoading(false);
    }
  }, [renderClientMarkers]);

  // Cargar clientes no asignados
  const loadUnassignedClients = useCallback(async () => {
    setLoading(true);

    // Verificar que el mapa esté inicializado
    if (!mapInstanceRef.current) {
      console.log("Esperando a que el mapa se inicialice antes de cargar clientes no asignados...");

      // Esperar hasta que el mapa se inicialice
      let attempts = 0;

      while (!mapInstanceRef.current && attempts < MAX_WAIT_ATTEMPTS) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }

      if (!mapInstanceRef.current) {
        console.error("No se pudo inicializar el mapa después de varios intentos");
        alert("Error al cargar el mapa. Por favor, recarga la página.");
        setLoading(false);
        return;
      }

      console.log("Mapa inicializado correctamente, continuando con la carga de clientes no asignados");
    }

    try {
      const { data, error } = await supabase.rpc("mostrar_clientes_no_asignados");

      if (error) {
        console.error("Error obteniendo clientes no asignados:", error);
        alert("Error al cargar clientes no asignados");
        return;
      }

      console.log("Datos originales recibidos (no asignados):", data);
      console.log(`Número de clientes no asignados recibidos: ${data?.length || 0}`);

      // Mapear correctamente usando latitud y longitud (nombres en español)
      const clients = (data || []).map((item: RpcClientResponseItem, index: number) => {
        console.log(`Procesando cliente no asignado ${index + 1}:`, item);

        // Verificar los valores recibidos
        if (!(item.latitud && item.longitud)) {
          console.warn(`Cliente ${index} sin coordenadas válidas:`, item);
        }

        // Asegurarnos de que id es un string
        const idString = item.id?.toString() || index.toString();

        const client = {
          // Preservar los campos originales
          ...item,
          // Sobrescribir id con versión string si es necesario
          id: idString,
          // Asegurarnos de tener un nombre para mostrar
          nombre: item.cliente_nombre || item.nombre || `Cliente ${index + 1}`,
          // Preservar nombres originales en español
          latitud: Number(item.latitud) || 0,
          longitud: Number(item.longitud) || 0,
          // Añadir formato compatible con Google Maps
          lat: Number(item.latitud) || 0,
          lng: Number(item.longitud) || 0,
        };

        return client;
      });

      console.log("Clientes no asignados procesados:", clients);

      setClientsData((prev) => ({ ...prev, unassigned: clients }));
      setActiveFilter("unassigned");
      renderClientMarkers(clients, false);

      console.log("Clientes no asignados cargados:", clients);
    } catch (error) {
      console.error("Error ejecutando RPC mostrar_clientes_no_asignados:", error);
      alert("Error de conexión con la base de datos");
    } finally {
      setLoading(false);
    }
  }, [renderClientMarkers]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    clearMarkers();
    setActiveFilter("none");
  }, [clearMarkers]);

  // Inicializar mapa con comprobación de disponibilidad
  const initializeMap = useCallback(() => {
    // Verificar si ya está inicializado
    if (mapInstanceRef.current) {
      console.log("El mapa ya está inicializado");
      return;
    }

    // Verificaciones más detalladas
    if (!mapRef.current) {
      console.error("No se puede inicializar el mapa: mapRef.current es null");
      return;
    }

    if (!window.google) {
      console.error("No se puede inicializar el mapa: window.google no está disponible");
      return;
    }

    if (!window.google.maps) {
      console.error("No se puede inicializar el mapa: window.google.maps no está disponible");
      return;
    }

    console.log("Inicializando mapa de Google Maps...");
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

      console.log("Mapa creado, esperando evento 'idle'...");

      // Asignar el mapa a la referencia solo cuando esté completamente cargado
      window.google.maps.event.addListenerOnce(map, "idle", () => {
        console.log("Mapa completamente cargado y listo");
        mapInstanceRef.current = map;

        // Añadir un marcador en el centro para verificar que el mapa funciona
        try {
          // Usar marcador tradicional por defecto para el centro
          new window.google.maps.Marker({
            position: DEFAULT_CENTER,
            map,
            title: "Centro del mapa",
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });
          console.log("Marcador central creado correctamente");
        } catch (error) {
          console.error("Error al crear marcador central:", error);
        }
      });
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
    }
  }, []);

  useEffect(() => {
    // Solo limpieza cuando el componente se desmonte
    return () => {
      if (mapInstanceRef.current) {
        console.log("Limpiando instancia del mapa");
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Efecto separado para inicializar el mapa cuando esté disponible
  useEffect(() => {
    // Solo intentar inicializar si tenemos el mapRef y google está disponible
    if (mapRef.current && window.google && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [initializeMap]);

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

    // Inicializar el mapa una vez que Google Maps esté cargado y el componente montado
    setTimeout(() => {
      if (window.google && mapRef.current && !mapInstanceRef.current) {
        console.log("Inicializando mapa después del montaje del componente");
        initializeMap();
      }
    }, MAP_INIT_DELAY_MS);

    return (
      <MapComponent
        activeFilter={activeFilter}
        clientsData={clientsData}
        loading={loading}
        mapRef={mapRef}
        onClearFilters={clearFilters}
        onCreateTestMarker={createTestMarker}
        onLoadAssignedClients={loadAssignedClients}
        onLoadUnassignedClients={loadUnassignedClients}
        onRefreshMarkers={refreshMarkers}
      />
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
      <Wrapper apiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]} render={renderMap} />
    </div>
  );
};

export { SectorsMap };
