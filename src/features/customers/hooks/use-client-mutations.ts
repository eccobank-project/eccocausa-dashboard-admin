import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteClient,
  deleteMultipleClients,
  updateClient,
} from "../actions/mutate";
import type { ClientList } from "../types/client-list";

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      // Invalidate and refetch client list
      queryClient.invalidateQueries({ queryKey: ["clientList"] });
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
    },
  });
};

export const useDeleteMultipleClients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMultipleClients,
    onSuccess: () => {
      // Invalidate and refetch client list
      queryClient.invalidateQueries({ queryKey: ["clientList"] });
    },
    onError: (error) => {
      console.error("Error deleting clients:", error);
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ClientList> }) =>
      updateClient(id, data),
    onSuccess: () => {
      // Invalidate and refetch client list
      queryClient.invalidateQueries({ queryKey: ["clientList"] });
    },
    onError: (error) => {
      console.error("Error updating client:", error);
    },
  });
};
