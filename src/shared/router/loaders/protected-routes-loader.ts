import { createQueryLoader } from "@/shared/router/utils/query-loader-utils";

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const ONE_HOUR = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const TWO_HOURS = ONE_HOUR * 2;

// Función simple que no requiere datos específicos
const fetchEmptyData = () => {
  return Promise.resolve(null);
};

// Loader genérico para rutas protegidas que no requieren datos específicos
// Los middlewares ya se aplican en la configuración de rutas
export const protectedRouteLoader = createQueryLoader(
  ["protectedRoute"], // Query key genérico
  fetchEmptyData,
  {
    staleTime: ONE_HOUR,
    gcTime: TWO_HOURS,
  }
);

// Loaders específicos para cada feature (pueden expandirse en el futuro)
// Cada uno puede tener su propio queryKey y fetchFn cuando sea necesario
export const collectorsLoader = createQueryLoader(
  ["collectors"],
  fetchEmptyData,
  { staleTime: ONE_HOUR, gcTime: TWO_HOURS }
);

export const mapLoader = createQueryLoader(["map"], fetchEmptyData, {
  staleTime: ONE_HOUR,
  gcTime: TWO_HOURS,
});

export const sectorsLoader = createQueryLoader(["sectors"], fetchEmptyData, {
  staleTime: ONE_HOUR,
  gcTime: TWO_HOURS,
});

export const settingsLoader = createQueryLoader(["settings"], fetchEmptyData, {
  staleTime: ONE_HOUR,
  gcTime: TWO_HOURS,
});
