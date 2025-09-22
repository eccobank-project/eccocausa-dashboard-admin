/** biome-ignore-all lint/style/noMagicNumbers: Cache configuration constants */

import { supabase } from "@/shared/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import {
  fetchSectorById,
  fetchSectors,
  fetchSectorWithGeometry,
} from "../actions/query";

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

export const useSectorListWithGeometry = () => {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["sectorListWithGeometry"],
    queryFn: async () => {
      const { data: sectorsData, error: sectorsError } = await supabase
        .from("sector")
        .select("id, nombre, id_ciudad, color, dia_recojo, geom")
        .order("nombre", { ascending: true });

      if (sectorsError) {
        throw new Error(
          `Error fetching sectors with geometry: ${sectorsError.message}`
        );
      }

      return sectorsData || [];
    },
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

export const useSectorWithGeometry = (id: number | undefined) => {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["sectorWithGeometry", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Sector ID is required");
      }
      return fetchSectorWithGeometry(id);
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
