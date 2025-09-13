import { supabase } from "@/shared/lib/supabase";
import type { AuthorizedEmails } from "../types/actionsTypes";

// Constants for table names variables
const AuthorizedEmailsTable = "correos_autorizados";

// Create a new authorized email
export const createAuthorizedEmail = async (
  emailData: Omit<AuthorizedEmails, "id">
): Promise<AuthorizedEmails> => {
  const { data, error } = await supabase
    .from(AuthorizedEmailsTable)
    .insert([emailData])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating authorized email: ${error.message}`);
  }

  return data as AuthorizedEmails;
};

// Update an existing authorized email
export const updateAuthorizedEmail = async (
  id: number,
  updates: Partial<Omit<AuthorizedEmails, "id">>
): Promise<AuthorizedEmails> => {
  const { data, error } = await supabase
    .from(AuthorizedEmailsTable)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating authorized email: ${error.message}`);
  }

  return data as AuthorizedEmails;
};

// Delete an authorized email
export const deleteAuthorizedEmail = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from(AuthorizedEmailsTable)
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Error deleting authorized email: ${error.message}`);
  }
};

// Toggle access for an authorized email
export const toggleEmailAccess = async (
  id: number,
  permitir_acceso: boolean
): Promise<AuthorizedEmails> => {
  const { data, error } = await supabase
    .from(AuthorizedEmailsTable)
    .update({ permitir_acceso })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error toggling email access: ${error.message}`);
  }

  return data as AuthorizedEmails;
};
