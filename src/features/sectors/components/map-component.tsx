import { AlertCircle, Loader2, Users, UserX } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MapComponentProps = {
  loading: boolean;
  activeFilter: "none" | "assigned" | "unassigned";
  clientsData: {
    assigned: Array<{
      id: string;
      nombre: string;
    }>;
    unassigned: Array<{
      id: string;
      nombre: string;
    }>;
  };
  mapRef: React.RefObject<HTMLDivElement | null>;
  onLoadAssignedClients: () => void;
  onLoadUnassignedClients: () => void;
  onClearFilters: () => void;
};

// Componente para el mapa y controles UI
const MapComponent = ({
  loading,
  activeFilter,
  clientsData,
  mapRef,
  onLoadAssignedClients,
  onLoadUnassignedClients,
  onClearFilters,
}: MapComponentProps) => {
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            className="gap-2"
            disabled={loading}
            onClick={onLoadAssignedClients}
            variant={activeFilter === "assigned" ? "default" : "outline"}
          >
            <Users className="h-4 w-4" />
            {loading && activeFilter === "assigned" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              "Clientes Asignados"
            )}
          </Button>

          <Button
            className="gap-2"
            disabled={loading}
            onClick={onLoadUnassignedClients}
            variant={activeFilter === "unassigned" ? "default" : "outline"}
          >
            <UserX className="h-4 w-4" />
            {loading && activeFilter === "unassigned" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              "Clientes No Asignados"
            )}
          </Button>

          <Button disabled={loading || activeFilter === "none"} onClick={onClearFilters} variant="ghost">
            Limpiar Filtro
          </Button>
        </div>

        {/* Información del filtro activo */}
        <div className="flex gap-2">
          {activeFilter === "assigned" && (
            <Badge className="gap-1" variant="secondary">
              <Users className="h-3 w-3" />
              Asignados: {clientsData.assigned.length}
            </Badge>
          )}

          {activeFilter === "unassigned" && (
            <Badge className="gap-1" variant="outline">
              <UserX className="h-3 w-3" />
              Sin asignar: {clientsData.unassigned.length}
            </Badge>
          )}
        </div>
      </div>

      {/* Información del estado */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {activeFilter === "none" && "Selecciona un filtro para ver clientes en el mapa."}
          {activeFilter === "assigned" && `Mostrando ${clientsData.assigned.length} clientes asignados en el mapa.`}
          {activeFilter === "unassigned" &&
            `Mostrando ${clientsData.unassigned.length} clientes no asignados en el mapa.`}
        </AlertDescription>
      </Alert>

      {/* Mapa */}
      <div className="h-96 overflow-hidden rounded-lg" ref={mapRef} />
    </div>
  );
};

export { MapComponent };
