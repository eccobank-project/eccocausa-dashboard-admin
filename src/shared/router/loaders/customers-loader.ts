import { fetchClientList } from "@/features/customers/actions/query";
import { createQueryLoader } from "@/shared/router/utils/query-loader-utils";

// Constantes de cache (alineadas con useClientList)
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const ONE_HOUR = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const TWO_HOURS = ONE_HOUR * 2;

// Loader híbrido que combina React Router + TanStack Query
// ✅ Pre-poblará el cache antes de que el componente se monte
// ✅ Navegación instantánea cuando hay datos en cache
// ✅ TanStack Query maneja estado, re-fetching y invalidation
export const customersLoader = createQueryLoader(
  ["clientList"], // Query key que coincide con useClientList
  fetchClientList, // Función de fetch
  {
    staleTime: ONE_HOUR, // 1 hora - datos frescos
    gcTime: TWO_HOURS, // 2 horas - garbage collection
  }
);
