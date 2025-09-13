import { supabase } from "@/shared/lib/supabase";
import type { AuthorizedEmails } from "../types/actionsTypes";

// Constants for table names
const AuthorizedEmailsTable = "correos_autorizados";
const RegisterDateTable = "fecha_registro";

// Query to fetch all authorizedEmails
export const fetchAuthorizedEmails = async (): Promise<AuthorizedEmails[]> => {
  const { data, error } = await supabase
    .from(AuthorizedEmailsTable)
    .select("*")
    .order(RegisterDateTable, { ascending: false });

  if (error) {
    throw new Error(`Error fetching authorized emails: ${error.message}`);
  }

  return data as AuthorizedEmails[];
};
