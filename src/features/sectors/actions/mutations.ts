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
  // Si hay geometría, usar RPC para manejar la conversión de GeoJSON
  if (sectorData.geom) {
    console.log("🔧 Usando RPC create_sector_with_geom");
    console.log("📝 Parámetros RPC:", {
      p_nombre: sectorData.nombre,
      p_id_ciudad: sectorData.id_ciudad,
      p_color: sectorData.color,
      p_dia_recojo: sectorData.dia_recojo,
      p_geom_json: sectorData.geom,
    });

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "create_sector_with_geom",
      {
        p_nombre: sectorData.nombre,
        p_id_ciudad: sectorData.id_ciudad,
        p_color: sectorData.color,
        p_dia_recojo: sectorData.dia_recojo,
        p_geom_json: sectorData.geom,
      }
    );

    console.log("✅ Respuesta RPC:", { rpcData, rpcError });

    if (rpcError) {
      throw new Error(
        `Error creating sector with geometry: ${rpcError.message}`
      );
    }

    if (!rpcData || rpcData.length === 0) {
      throw new Error("No data returned from RPC function");
    }

    return rpcData[0] as Sector;
  }

  // Sin geometría, usar inserción normal
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
  // Si hay geometría, usar RPC para manejar la conversión de GeoJSON
  if (updates.geom) {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "update_sector_with_geom",
      {
        p_id: id,
        p_nombre: updates.nombre,
        p_id_ciudad: updates.id_ciudad,
        p_color: updates.color,
        p_dia_recojo: updates.dia_recojo,
        p_geom_json: updates.geom,
      }
    );

    if (rpcError) {
      throw new Error(
        `Error updating sector with geometry: ${rpcError.message}`
      );
    }

    if (!rpcData || rpcData.length === 0) {
      throw new Error("No data returned from RPC function");
    }

    return rpcData[0] as Sector;
  }

  // Sin geometría, usar actualización normal
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
