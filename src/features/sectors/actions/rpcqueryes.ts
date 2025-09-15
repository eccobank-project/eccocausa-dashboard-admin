import { supabase } from "@/shared/lib/supabase";

const { data: assignedClients, error: assignedError } = await supabase.rpc(
  "mostrar_clientes_asignados"
);

const { data: unassignedClients, error: unassignedError } = await supabase.rpc(
  "mostrar_clientes_no_asignados"
);

if (assignedError) {
  throw new Error(`Error fetching assigned clients: ${assignedError.message}`);
}

if (unassignedError) {
  throw new Error(
    `Error fetching unassigned clients: ${unassignedError.message}`
  );
}

export const RpcQueries = {
  assignedClients: assignedClients || [],
  unassignedClients: unassignedClients || [],
};
