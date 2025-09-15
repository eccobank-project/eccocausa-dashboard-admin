import { supabase } from "@/shared/lib/supabase";
import type {
  CreateSectorRequest,
  Sector,
  UpdateSectorRequest,
} from "../types";

const SECTOR_TABLE = "sector";

export const createSector = async (
  sectorData: CreateSectorRequest
): Promise<Sector> => {
  const { data, error } = await supabase
    .from(SECTOR_TABLE)
    .insert([sectorData])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating sector: ${error.message}`);
  }

  return data as Sector;
};

export const updateSector = async ({
  id,
  ...updates
}: UpdateSectorRequest): Promise<Sector> => {
  const { data, error } = await supabase
    .from(SECTOR_TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating sector: ${error.message}`);
  }

  return data as Sector;
};

export const deleteSector = async (id: number): Promise<void> => {
  const { error } = await supabase.from(SECTOR_TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting sector: ${error.message}`);
  }
};

export const deleteMultipleSectors = async (ids: number[]): Promise<void> => {
  const { error } = await supabase.from(SECTOR_TABLE).delete().in("id", ids);

  if (error) {
    throw new Error(`Error deleting sectors: ${error.message}`);
  }
};
