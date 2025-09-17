import { createQueryLoader } from "@/shared/router/utils/query-loader-utils";

// Simulando que existe una acción para fetch de dashboard stats
// En este caso usaremos datos estáticos pero se puede reemplazar con fetch real

type DashboardStats = {
  connections: string;
  contacts: string;
  value: string;
  referrals: string;
};

const NETWORK_DELAY = 500;
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const ONE_HOUR = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const TWO_HOURS = ONE_HOUR * 2;

// Simular fetch de stats (esto se podría conectar a una API real)
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // Simular delay de network
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY));

  return {
    connections: "427,296",
    contacts: "37,429",
    value: "$82,439",
    referrals: "3,497",
  };
};

// Loader híbrido del dashboard que pre-puebla TanStack Query cache
export const dashboardLoader = createQueryLoader(
  ["dashboardStats"], // Query key único para dashboard
  fetchDashboardStats,
  {
    staleTime: ONE_HOUR, // Stats de dashboard frescos por 1 hora
    gcTime: TWO_HOURS, // Garbage collection después de 2 horas
  }
);
