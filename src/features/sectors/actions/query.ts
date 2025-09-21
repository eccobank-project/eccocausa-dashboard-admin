import { supabase } from "@/shared/lib/supabase";
import type { Sector } from "../types";

const SECTOR_TABLE = "sector";

export const fetchSectors = async (): Promise<Sector[]> => {
  const { data, error } = await supabase
    .from(SECTOR_TABLE)
    .select("id, nombre, id_ciudad, color, dia_recojo, created_at, updated_at")
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`Error fetching sectors: ${error.message}`);
  }

  // Cast to Sector array with geom as null since we're not fetching it
  return data.map((sector) => ({ ...sector, geom: null })) as Sector[];
};

export const fetchSectorById = async (id: number): Promise<Sector> => {
  const { data, error } = await supabase
    .from(SECTOR_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching sector: ${error.message}`);
  }

  return data as Sector;
};

export const fetchSectorWithGeometry = async (id: number): Promise<Sector> => {
  const { data, error } = await supabase
    .from(SECTOR_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching sector with geometry: ${error.message}`);
  }

  if (!data) {
    throw new Error("Sector not found");
  }

  return data as Sector;
};
