import { supabase } from "@/shared/lib/supabase";
import type { Sector } from "../types";

const SECTOR_TABLE = "sector";

export const fetchSectors = async (): Promise<Sector[]> => {
  const { data, error } = await supabase
    .from(SECTOR_TABLE)
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`Error fetching sectors: ${error.message}`);
  }

  return data as Sector[];
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
