/** biome-ignore-all lint/suspicious/noConsole: <debugging console.log> */
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { getOAuthRedirectUrl } from "../lib/url";

export type OAuthProvider = "google" | "azure";

type UseOAuthOptions = {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
};

const getProviderDisplayName = (provider: OAuthProvider): string => {
  return provider === "google" ? "Google" : "Microsoft";
};

const createErrorMessage = (provider: OAuthProvider, error: string): string => {
  return `Error al autenticarse con ${getProviderDisplayName(provider)}: ${error}`;
};

const createGenericErrorMessage = (provider: OAuthProvider): string => {
  return `Error inesperado al autenticarse con ${getProviderDisplayName(provider)}. Por favor, inténtalo de nuevo.`;
};

const handleOAuthError = (
  provider: OAuthProvider,
  error: string,
  onError?: (errorMessage: string) => void
) => {
  console.error(`${provider} OAuth error:`, error);
  const errorMessage = createErrorMessage(provider, error);
  onError?.(errorMessage);

  return { success: false, error: errorMessage };
};

const handleOAuthException = (
  provider: OAuthProvider,
  err: unknown,
  onError?: (errorMessage: string) => void
) => {
  console.error(`${provider} OAuth exception:`, err);
  const errorMessage = createGenericErrorMessage(provider);
  onError?.(errorMessage);
  return { success: false, error: errorMessage };
};

export const useOAuth = (options: UseOAuthOptions = {}) => {
  const [loading, setLoading] = useState(false);

  const signInWithOAuth = async (provider: OAuthProvider) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: options.redirectTo || getOAuthRedirectUrl("/"),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        return handleOAuthError(provider, error.message, options.onError);
      }

      if (options.onSuccess) {
        options.onSuccess();
      }

      return { success: true, error: null };
    } catch (err) {
      return handleOAuthException(provider, err, options.onError);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signInWithOAuth,
  };
};
