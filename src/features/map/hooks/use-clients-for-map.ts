/** biome-ignore-all lint/style/noMagicNumbers: Time constants configuration */

import { useQuery } from "@tanstack/react-query";
import { fetchClientList } from "../../customers/actions/query";
import type { ClientList } from "../../customers/types/client-list";
import type { ClientLocation } from "../types";

const DEFAULT_LATITUDE = 6.5244; // Lagos, Nigeria
const DEFAULT_LONGITUDE = 3.3792; // Lagos, Nigeria

// Cache configuration constants
const STALE_TIME = 1000 * 60 * 5; // 5 minutos - datos considerados frescos
const CACHE_TIME = 1000 * 60 * 30; // 30 minutos - datos en caché
const RETRY_COUNT = 3;
const BASE_DELAY = 1000;
const EXPONENTIAL_BASE = 2;
const MAX_DELAY = 30_000;

// Convert ClientList to ClientLocation format for the map
const convertClientToMapFormat = (client: ClientList): ClientLocation => ({
  id: client.id.toString(),
  name: client.nombre,
  email: `cliente${client.id}@example.com`,
  phone: `+234 ${client.codigo}`,
  address: `Cliente ${client.codigo} - Lagos, Nigeria`,
  latitude: client.latitud || DEFAULT_LATITUDE,
  longitude: client.longitud || DEFAULT_LONGITUDE,
  avatar: client.foto || "",
  status:
    client.estado === "activo" ? ("active" as const) : ("inactive" as const),
  lastContact: client.fecha_registro?.toString(),
  totalCollections: 0,
});

/**
 * Hook para obtener la lista de clientes desde el caché de TanStack Query
 * Reutiliza la misma query key ["clientList"] que se usa en la vista de customers
 */
export const useClientsForMap = () => {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["clientList"],
    queryFn: fetchClientList,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: RETRY_COUNT,
    retryDelay: (attemptIndex) =>
      Math.min(BASE_DELAY * EXPONENTIAL_BASE ** attemptIndex, MAX_DELAY),
  });

  // Convertir datos de ClientList a ClientLocation para el mapa
  const clients: ClientLocation[] = data?.map(convertClientToMapFormat) || [];

  // Filtrar solo clientes que tienen coordenadas válidas
  const clientsWithLocation = clients.filter(
    (client) =>
      client.latitude !== DEFAULT_LATITUDE ||
      client.longitude !== DEFAULT_LONGITUDE
  );

  return {
    clients,
    clientsWithLocation,
    allClients: data || [], // Datos originales sin transformar
    error,
    isLoading,
    isFetching,
    totalClients: clients.length,
    activeClients: clients.filter((client) => client.status === "active")
      .length,
    clientsWithCoordinates: clientsWithLocation.length,
  };
};
