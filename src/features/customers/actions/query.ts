import { supabase } from "@/shared/lib/supabase";
import type { ClientList } from "../types/client-list";

// Query to fetch all clients

const ClientListTable = "clientes";
const RegisterDateTable = "fecha_registro";

export const fetchClientList = async (): Promise<ClientList[]> => {
  const { data, error } = await supabase
    .from(ClientListTable)
    .select("*")
    .order(RegisterDateTable, { ascending: false });

  if (error) {
    throw new Error(`Error fetching client list: ${error.message}`);
  }

  return data as ClientList[];
};
