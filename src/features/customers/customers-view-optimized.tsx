import { useLoaderData } from "react-router-dom";
import CustomersTable from "./components/customers-table";
import { CustomerHeader } from "./components/header/customer-header";
import { CustomerStats } from "./components/stats/customer-stats";
import { useDeleteClient, useDeleteMultipleClients } from "./hooks/use-client-mutations";
import type { ClientList } from "./types/client-list";
import { calculateCustomerStats } from "./utils/customer-calculations";

const RECENT_RECORDS_LIMIT = 7;

type CustomersLoaderData = {
  clientList: ClientList[];
};

const CustomersView = () => {
  // Obtener datos del loader en lugar del hook
  const { clientList } = useLoaderData() as CustomersLoaderData;

  const deleteClientMutation = useDeleteClient();
  const deleteMultipleClientsMutation = useDeleteMultipleClients();

  const handleAddCustomer = () => {
    // TODO: Open add customer modal/form
    console.log("Adding new customer");
  };

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

  // Calculate stats from data using utility function
  const { totalCustomers, activeCustomers, activePercentage } = calculateCustomerStats(clientList);
  const recentRecords = clientList?.slice(0, RECENT_RECORDS_LIMIT).length || 0;

  return (
    <div className="space-y-6">
      <CustomerHeader onAddCustomer={handleAddCustomer} />

      <CustomerStats
        activeCustomers={activeCustomers}
        activePercentage={activePercentage}
        recentRecords={recentRecords}
        totalCustomers={totalCustomers}
      />

      {/* Table */}
      <div className="min-h-[50vh] flex-1">
        <CustomersTable
          data={clientList || []}
          isLoading={false} // Ya no necesitamos loading state porque los datos vienen del loader
          onBulkDelete={handleBulkDelete}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default CustomersView;
