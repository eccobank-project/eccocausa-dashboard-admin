import { Button } from "@/components/ui/button";
import CustomersTable from "./components/customers-table";
import { useClientList } from "./hooks/use-client-list";
import { useDeleteClient, useDeleteMultipleClients } from "./hooks/use-client-mutations";
import type { ClientList } from "./types/client-list";

const PERCENTAGE_MULTIPLIER = 100;
const RECENT_RECORDS_LIMIT = 7;

const CustomersView = () => {
  const { data, isLoading } = useClientList();
  const deleteClientMutation = useDeleteClient();
  const deleteMultipleClientsMutation = useDeleteMultipleClients();

  const handleEdit = (client: ClientList) => {
    // TODO: Open edit modal/form
    console.log("Editing client:", client);
  };

  const handleDelete = async (client: ClientList) => {
    try {
      await deleteClientMutation.mutateAsync(client.id);
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const handleBulkDelete = async (clients: ClientList[]) => {
    try {
      const clientIds = clients.map((client) => client.id);
      await deleteMultipleClientsMutation.mutateAsync(clientIds);
    } catch (error) {
      console.error("Failed to delete clients:", error);
    }
  };

  // Calculate stats from data
  const totalCustomers = data?.length || 0;
  const activeCustomers = data?.filter((client) => client.estado === "activo").length || 0;
  const activePercentage =
    totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * PERCENTAGE_MULTIPLIER) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">Gestión de Clientes</h1>
          <p className="text-muted-foreground text-sm">
            Visualiza y gestiona cuentas de clientes, historial de pagos e información de contacto.
          </p>
        </div>
        <Button className="px-3">Agregar Cliente</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Total Clientes</h3>
          </div>
          <div className="font-bold text-2xl">{totalCustomers.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">Clientes registrados</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Cuentas Activas</h3>
          </div>
          <div className="font-bold text-2xl">{activeCustomers.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">{activePercentage}% del total de clientes</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Últimos Registros</h3>
          </div>
          <div className="font-bold text-2xl">{data?.slice(0, RECENT_RECORDS_LIMIT).length || 0}</div>
          <p className="text-muted-foreground text-xs">Esta semana</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm">Tasa de Actividad</h3>
          </div>
          <div className="font-bold text-2xl">{activePercentage}%</div>
          <p className="text-muted-foreground text-xs">Clientes activos</p>
        </div>
      </div>

      {/* Table */}
      <div className="min-h-[50vh] flex-1">
        <CustomersTable
          data={data || []}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default CustomersView;
