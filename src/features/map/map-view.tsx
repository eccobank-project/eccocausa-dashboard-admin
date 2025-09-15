import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/shared/lib/supabase";
import type { ClientList } from "../customers/types/client-list";
import { GoogleMap } from "./components/google-map";
import { useClientsForMap } from "./hooks/use-clients-for-map";

const DECIMAL_PLACES = 4;
const DEFAULT_LATITUDE = 6.5244; // Lagos, Nigeria
const DEFAULT_LONGITUDE = 3.3792; // Lagos, Nigeria

// Function to fetch a specific client by ID
const fetchClientById = async (id: string): Promise<ClientList> => {
  const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single();

  if (error) {
    throw new Error(`Error fetching client: ${error.message}`);
  }

  return data as ClientList;
};

// Helper function to convert client data
const convertClientToMapFormat = (client: ClientList) => ({
  id: client.id.toString(),
  name: client.nombre,
  email: `cliente${client.id}@example.com`,
  phone: `+234 ${client.codigo}`,
  address: `Cliente ${client.codigo} - Lagos, Nigeria`,
  latitude: client.latitud || DEFAULT_LATITUDE,
  longitude: client.longitud || DEFAULT_LONGITUDE,
  avatar: client.foto || "",
  status: client.estado === "activo" ? ("active" as const) : ("inactive" as const),
  lastContact: client.fecha_registro?.toString(),
  totalCollections: 0,
});

const MapView = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const {
    clients,
    isLoading: isLoadingClients,
    totalClients,
    activeClients,
    clientsWithCoordinates,
  } = useClientsForMap();

  // Query for specific client if clientId is provided
  const { data: selectedClient } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => {
      if (!clientId) {
        throw new Error("Client ID is required");
      }
      return fetchClientById(clientId);
    },
    enabled: Boolean(clientId),
  });

  const isViewingSpecificClient = Boolean(clientId && selectedClient);

  // Convert client data for the map
  const mapClients = isViewingSpecificClient && selectedClient ? [convertClientToMapFormat(selectedClient)] : clients;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">
            {isViewingSpecificClient ? `Mapa - ${selectedClient?.nombre}` : "Vista de Mapa"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isViewingSpecificClient
              ? "Ubicación del cliente en el mapa interactivo"
              : "Rastrea cobradores y clientes en el mapa interactivo."}
          </p>
        </div>
        {isViewingSpecificClient && (
          <Badge className="gap-1" variant="outline">
            📍 Cliente Específico
          </Badge>
        )}
      </div>

      {/* Client Details Card - Only show when viewing specific client */}
      {isViewingSpecificClient && selectedClient && (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-4 font-semibold text-lg">Información del Cliente</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">Nombre</p>
              <p className="font-semibold">{selectedClient.nombre}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">Código</p>
              <p className="font-mono text-sm">{selectedClient.codigo}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">Estado</p>
              <Badge
                className={selectedClient.estado === "activo" ? "text-green-600" : "text-gray-500"}
                variant="outline"
              >
                {selectedClient.estado}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">Coordenadas</p>
              <p className="text-sm">
                {selectedClient.latitud?.toFixed(DECIMAL_PLACES)}, {selectedClient.longitud?.toFixed(DECIMAL_PLACES)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Total Clientes</h3>
          </div>
          <div className="font-bold text-2xl">{isLoadingClients ? "..." : totalClients.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">Clientes registrados</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Clientes Activos</h3>
          </div>
          <div className="font-bold text-2xl">{isLoadingClients ? "..." : activeClients.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">Con estado activo</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Con Ubicación</h3>
          </div>
          <div className="font-bold text-2xl">{isLoadingClients ? "..." : clientsWithCoordinates.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">Coordenadas válidas</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">En el Mapa</h3>
          </div>
          <div className="font-bold text-2xl">{isLoadingClients ? "..." : mapClients.length.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">
            {isViewingSpecificClient ? "Cliente individual" : "Todos los clientes"}
          </p>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 font-semibold text-lg">
          {isViewingSpecificClient ? `Ubicación de ${selectedClient?.nombre}` : "Mapa Interactivo"}
        </h3>
        <div className="h-96 overflow-hidden rounded-lg">
          {isLoadingClients ? (
            <div className="flex h-full items-center justify-center bg-muted/50">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground text-sm">Cargando clientes...</p>
              </div>
            </div>
          ) : (
            <GoogleMap className="h-full w-full" clients={mapClients} selectedClientId={clientId} />
          )}
        </div>
      </div>

      {/* Live Updates */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 font-semibold text-lg">Actualizaciones en Vivo</h3>
        <div className="space-y-3">
          {isViewingSpecificClient && selectedClient ? (
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Cliente seleccionado en el mapa</p>
                <p className="text-muted-foreground text-sm">
                  {selectedClient.nombre} - {selectedClient.codigo}
                </p>
              </div>
              <span className="text-muted-foreground text-sm">Ahora</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">John Doe llegó a la ubicación</p>
              <p className="text-muted-foreground text-sm">Zona Norte - Cliente #4521</p>
            </div>
            <span className="text-muted-foreground text-sm">hace 2 min</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Ruta #143 completada</p>
              <p className="text-muted-foreground text-sm">Sarah Wilson - 8 clientes visitados</p>
            </div>
            <span className="text-muted-foreground text-sm">hace 15 min</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Nueva ruta asignada</p>
              <p className="text-muted-foreground text-sm">Mike Johnson - Zona Centro</p>
            </div>
            <span className="text-muted-foreground text-sm">hace 28 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MapView };
