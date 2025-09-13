/** biome-ignore-all lint/style/noMagicNumbers: Magic String  */

import { useQuery } from "@tanstack/react-query";
import { fetchClientList } from "../actions/query";

const STALE_TIME = 1000 * 60 * 5; // 5 minutos - datos considerados frescos
const CACHE_TIME = 1000 * 60 * 30; // 30 minutos - datos se mantienen en caché

export const useClientList = () => {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["clientList"],
    queryFn: fetchClientList,
    staleTime: STALE_TIME, // Datos frescos por 5 minutos
    gcTime: CACHE_TIME, // Datos en caché por 30 minutos (antes era cacheTime)
    retry: 3, // Reintentar 3 veces en caso de error
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000), // Backoff exponencial
  });
  return {
    data,
    error,
    isLoading, // Solo true en la primera carga sin datos en caché
    isFetching, // True cuando se está haciendo una request (incluye background updates)
    refetch,
  };
};
