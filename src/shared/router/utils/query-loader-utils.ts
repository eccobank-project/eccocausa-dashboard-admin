import type { QueryClient } from "@tanstack/react-query";

/**
 * Utilidad para crear loaders que pre-pueblan el cache de TanStack Query
 * Esto combina las ventajas de loaders (navegación instantánea) con TanStack Query (cache inteligente)
 */

// Constantes de tiempo
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const ONE_HOUR_MS =
  MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR; // 3,600,000ms
const TWO_HOURS_MS = ONE_HOUR_MS * 2; // 7,200,000ms

// Singleton QueryClient para uso en loaders (fuera del contexto React)
let globalQueryClient: QueryClient | null = null;

export const initializeGlobalQueryClient = (queryClient: QueryClient) => {
  globalQueryClient = queryClient;
};

export const getGlobalQueryClient = (): QueryClient => {
  if (!globalQueryClient) {
    throw new Error(
      "Global QueryClient not initialized. Call initializeGlobalQueryClient first."
    );
  }
  return globalQueryClient;
};

/**
 * Crea un loader que pre-puebla el cache de TanStack Query
 */
export const createQueryLoader = <T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: {
    staleTime?: number;
    gcTime?: number;
  }
) => {
  return async () => {
    const queryClient = getGlobalQueryClient();

    // Verificar si ya tenemos datos frescos en cache
    const existingData = queryClient.getQueryData(queryKey);
    const queryState = queryClient.getQueryState(queryKey);

    // Si tenemos datos frescos, no hacer fetch
    if (existingData && queryState && !queryState.isInvalidated) {
      const now = Date.now();
      const staleTime = options?.staleTime ?? ONE_HOUR_MS;
      const dataTime = queryState.dataUpdatedAt;

      if (now - dataTime < staleTime) {
        return existingData;
      }
    }

    // Pre-poblar el cache (no blocking - se ejecuta en paralelo)
    try {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: options?.staleTime ?? ONE_HOUR_MS,
        gcTime: options?.gcTime ?? TWO_HOURS_MS,
      });

      // Retornar los datos para el loader
      return queryClient.getQueryData(queryKey);
    } catch (error) {
      // En caso de error, el componente manejará la carga con useQuery
      console.warn(
        "Loader prefetch failed, component will handle loading:",
        error
      );
      return null;
    }
  };
};

/**
 * Invalida queries específicas desde un loader
 */
export const invalidateQueries = (queryKey: readonly unknown[]) => {
  const queryClient = getGlobalQueryClient();
  return queryClient.invalidateQueries({ queryKey });
};

/**
 * Obtiene datos del cache sin hacer fetch
 */
export const getCachedData = <T>(
  queryKey: readonly unknown[]
): T | undefined => {
  const queryClient = getGlobalQueryClient();
  return queryClient.getQueryData(queryKey);
};
