/** biome-ignore-all lint/style/noMagicNumbers: Cache configuration constants */

import { useQuery } from "@tanstack/react-query";
import { fetchSectorById, fetchSectors } from "../actions/query";

const STALE_TIME = 1000 * 60 * 5; // 5 minutos
const CACHE_TIME = 1000 * 60 * 30; // 30 minutos
const RETRY_COUNT = 3;
const BASE_DELAY = 1000;
const EXPONENTIAL_BASE = 2;
const MAX_DELAY = 30_000;

export const useSectorList = () => {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["sectorList"],
    queryFn: fetchSectors,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: RETRY_COUNT,
    retryDelay: (attemptIndex) =>
      Math.min(BASE_DELAY * EXPONENTIAL_BASE ** attemptIndex, MAX_DELAY),
  });

  return {
    data: data || [],
    error,
    isLoading,
    isFetching,
    refetch,
    totalSectors: data?.length || 0,
  };
};

export const useSector = (id: number | undefined) => {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["sector", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Sector ID is required");
      }
      return fetchSectorById(id);
    },
    enabled: Boolean(id),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: RETRY_COUNT,
    retryDelay: (attemptIndex) =>
      Math.min(BASE_DELAY * EXPONENTIAL_BASE ** attemptIndex, MAX_DELAY),
  });

  return {
    data,
    error,
    isLoading,
    isFetching,
  };
};
