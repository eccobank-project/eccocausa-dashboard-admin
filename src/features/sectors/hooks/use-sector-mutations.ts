import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSector,
  deleteMultipleSectors,
  deleteSector,
  updateSector,
} from "../actions/mutations";

export const useCreateSector = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSector,
    onSuccess: () => {
      // Invalidar y refrescar la lista de sectores
      queryClient.invalidateQueries({ queryKey: ["sectorList"] });
    },
    onError: (error) => {
      console.error("Error creating sector:", error);
    },
  });
};

export const useUpdateSector = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSector,
    onSuccess: (updatedSector) => {
      // Invalidar la lista de sectores
      queryClient.invalidateQueries({ queryKey: ["sectorList"] });
      // Actualizar el sector específico en caché
      queryClient.invalidateQueries({ queryKey: ["sector", updatedSector.id] });
    },
    onError: (error) => {
      console.error("Error updating sector:", error);
    },
  });
};

export const useDeleteSector = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSector,
    onSuccess: () => {
      // Invalidar la lista de sectores
      queryClient.invalidateQueries({ queryKey: ["sectorList"] });
    },
    onError: (error) => {
      console.error("Error deleting sector:", error);
    },
  });
};

export const useDeleteMultipleSectors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMultipleSectors,
    onSuccess: () => {
      // Invalidar la lista de sectores
      queryClient.invalidateQueries({ queryKey: ["sectorList"] });
    },
    onError: (error) => {
      console.error("Error deleting sectors:", error);
    },
  });
};
