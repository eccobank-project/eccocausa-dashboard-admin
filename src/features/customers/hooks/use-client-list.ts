/** biome-ignore-all lint/style/noMagicNumbers: Constants defined clearly  */

import { useQuery } from "@tanstack/react-query";
import { fetchClientList } from "../actions/query";

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const ONE_HOUR = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const TWO_HOURS = ONE_HOUR * 2;
const MAX_RETRY_DELAY = 10_000; // 10 segundos
const RETRY_BASE_DELAY = 1000; // 1 segundo
const RETRY_MULTIPLIER = 2;
const RETRY_ATTEMPTS = 2;

/**
 * Hook para gestionar la lista de clientes
 * Funciona en conjunto con customersLoader para navegación instantánea:
 *
 * 1. El loader pre-puebla el cache antes de que el componente se monte
 * 2. Este hook lee los datos del cache (isLoading será false si hay datos)
 * 3. TanStack Query maneja actualizaciones, invalidación y estado reactivo
 */
export const useClientList = () => {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["clientList"], // ⚠️ DEBE coincidir con el queryKey del loader
    queryFn: fetchClientList,
    staleTime: ONE_HOUR, // Datos frescos por 1 hora (no refetch en background)
    gcTime: TWO_HOURS, // Datos en caché por 2 horas antes de ser garbage collected
    retry: RETRY_ATTEMPTS, // Reducir reintentos para evitar demoras
    retryDelay: (attemptIndex) =>
      Math.min(
        RETRY_BASE_DELAY * RETRY_MULTIPLIER ** attemptIndex,
        MAX_RETRY_DELAY
      ),
    refetchOnWindowFocus: false, // No refetch al cambiar de pestaña
    refetchOnReconnect: true, // Solo refetch si se reconecta la red

    // ✨ Optimización híbrida: usar datos del cache si están disponibles
    // Esto hace que isLoading sea false si el loader ya pre-pobló los datos
    initialDataUpdatedAt: () => {
      // Permitir que TanStack Query use datos del cache como "initial data"
      return Date.now();
    },
  });

  return {
    data,
    error,
    isLoading, // false si el loader ya cargó los datos en cache
    isFetching, // true cuando se está haciendo una request (incluye background updates)
    refetch,
  };
};
