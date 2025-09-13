import { supabase } from "@/shared/lib/supabase";
import type { ClientList } from "../types/client-list";

const ClientListTable = "clientes";

// Mutation to delete a client
export const deleteClient = async (id: number): Promise<void> => {
  const { error } = await supabase.from(ClientListTable).delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting client: ${error.message}`);
  }
};

// Mutation to delete multiple clients
export const deleteMultipleClients = async (ids: number[]): Promise<void> => {
  const { error } = await supabase.from(ClientListTable).delete().in("id", ids);

  if (error) {
    throw new Error(`Error deleting clients: ${error.message}`);
  }
};

// Mutation to update a client
export const updateClient = async (
  id: number,
  data: Partial<ClientList>
): Promise<ClientList> => {
  const { data: updatedClient, error } = await supabase
    .from(ClientListTable)
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating client: ${error.message}`);
  }

  return updatedClient as ClientList;
};
