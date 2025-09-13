import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/shared/lib/supabase";
import type { ClientList } from "../customers/types/client-list";

const DECIMAL_PLACES = 4;

// Function to fetch a specific client by ID
const fetchClientById = async (id: string): Promise<ClientList> => {
  const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single();

  if (error) {
    throw new Error(`Error fetching client: ${error.message}`);
  }

  return data as ClientList;
};

const MapView = () => {
  const { clientId } = useParams<{ clientId: string }>();

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
            <h3 className="font-medium text-sm">Rutas Activas</h3>
          </div>
          <div className="font-bold text-2xl">12</div>
          <p className="text-muted-foreground text-xs">Rutas en progreso</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Cobradores Online</h3>
          </div>
          <div className="font-bold text-2xl">18</div>
          <p className="text-muted-foreground text-xs">Actualmente rastreando</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Áreas Cubiertas</h3>
          </div>
          <div className="font-bold text-2xl">8</div>
          <p className="text-muted-foreground text-xs">Zonas de servicio activas</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Completadas Hoy</h3>
          </div>
          <div className="font-bold text-2xl">67</div>
          <p className="text-muted-foreground text-xs">Cobranzas terminadas</p>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 font-semibold text-lg">
          {isViewingSpecificClient ? `Ubicación de ${selectedClient?.nombre}` : "Mapa Interactivo"}
        </h3>
        <div className="flex h-96 items-center justify-center rounded-lg bg-muted">
          <div className="text-center">
            <div className="mb-2 text-4xl">🗺️</div>
            <p className="font-medium text-lg">Componente de Mapa</p>
            {isViewingSpecificClient && selectedClient ? (
              <div className="mt-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Mostrando ubicación del cliente: {selectedClient.nombre}
                </p>
                <p className="text-muted-foreground text-xs">
                  Coordenadas: {selectedClient.latitud?.toFixed(DECIMAL_PLACES)},{" "}
                  {selectedClient.longitud?.toFixed(DECIMAL_PLACES)}
                </p>
                <div className="mt-2 text-2xl">📍</div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">El mapa interactivo se implementará aquí</p>
            )}
          </div>
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

export default MapView;
