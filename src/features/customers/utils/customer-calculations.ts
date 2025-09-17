import type { ClientList } from "../types/client-list";

const PERCENTAGE_MULTIPLIER = 100;

/**
 * Calcula las estadísticas de clientes basado en los datos
 */
export function calculateCustomerStats(data: ClientList[]) {
  const totalCustomers = data?.length || 0;
  const activeCustomers =
    data?.filter((client) => client.estado === "activo").length || 0;
  const activePercentage =
    totalCustomers > 0
      ? Math.round((activeCustomers / totalCustomers) * PERCENTAGE_MULTIPLIER)
      : 0;

  return {
    totalCustomers,
    activeCustomers,
    activePercentage,
  };
}

/**
 * Filtra clientes por criterios específicos
 */
export function filterCustomers(
  data: ClientList[],
  filters: {
    status?: string;
    searchTerm?: string;
  }
) {
  let filtered = [...data];

  if (filters.status) {
    filtered = filtered.filter((client) => client.estado === filters.status);
  }

  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (client) =>
        client.nombre?.toLowerCase().includes(searchLower) ||
        client.codigo?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

type SortBy = "name" | "date" | "status";

/**
 * Ordena clientes por diferentes criterios
 */
export function sortCustomers(data: ClientList[], sortBy: SortBy) {
  return [...data].sort((a, b) => {
    if (sortBy === "name") {
      return (a.nombre || "").localeCompare(b.nombre || "");
    }
    if (sortBy === "date") {
      return (
        new Date(b.fecha_registro || 0).getTime() -
        new Date(a.fecha_registro || 0).getTime()
      );
    }
    if (sortBy === "status") {
      return (a.estado || "").localeCompare(b.estado || "");
    }
    return 0;
  });
}
