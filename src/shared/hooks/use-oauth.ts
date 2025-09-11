/** biome-ignore-all lint/suspicious/noConsole: <debugging console.log> */
import { useState } from "react";
import { supabase } from "../lib/supabase";

export type OAuthProvider = "google" | "azure";

type UseOAuthOptions = {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export const useOAuth = (options: UseOAuthOptions = {}) => {
  const [loading, setLoading] = useState(false);

  const signInWithOAuth = async (provider: OAuthProvider) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: options.redirectTo || `${window.location.origin}/`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error(`${provider} OAuth error:`, error);
        const errorMessage = `Error al autenticarse con ${
          provider === "google" ? "Google" : "Microsoft"
        }: ${error.message}`;

        if (options.onError) {
          options.onError(errorMessage);
        }
        return { success: false, error: errorMessage };
      }

      if (options.onSuccess) {
        options.onSuccess();
      }

      return { success: true, error: null };
    } catch (err) {
      console.error(`${provider} OAuth exception:`, err);
      const errorMessage = `Error inesperado al autenticarse con ${
        provider === "google" ? "Google" : "Microsoft"
      }. Por favor, inténtalo de nuevo.`;

      if (options.onError) {
        options.onError(errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signInWithOAuth,
  };
};
