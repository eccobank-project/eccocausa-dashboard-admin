import { supabase } from "@/shared/lib/supabase";
import type { Sector } from "../types";

const SECTOR_TABLE = "sector";

export const fetchSectors = async (): Promise<Sector[]> => {
  const { data, error } = await supabase
    .from(SECTOR_TABLE)
    .select("id, nombre, id_ciudad, color, dia_recojo")
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
    .select("id, nombre, id_ciudad, color, dia_recojo, geom")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching sector: ${error.message}`);
  }

  return data as Sector;
};

export const fetchSectorsWithGeometry = async (): Promise<Sector[]> => {
  // Usar RPC para obtener todas las geometrías como GeoJSON
  const { data, error } = await supabase.rpc("get_all_sectors_with_geom");

  if (error) {
    throw new Error(`Error fetching sectors with geometry: ${error.message}`);
  }

  return (data as Sector[]) || [];
};

export const fetchSectorWithGeometry = async (id: number): Promise<Sector> => {
  // Usar RPC para obtener la geometría como GeoJSON
  const { data, error } = await supabase.rpc("get_sector_with_geom", {
    p_sector_id: id,
  });

  if (error) {
    throw new Error(`Error fetching sector with geometry: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error("Sector not found");
  }

  return data[0] as Sector;
};
