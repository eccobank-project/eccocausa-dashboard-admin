import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type AuthError = {
  error: string;
  errorCode: string;
  errorDescription: string;
};

export const useAuthError = () => {
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.substring(1));

    // Check both search params and hash params for error information
    const error = searchParams.get("error") || hashParams.get("error");
    const errorCode =
      searchParams.get("error_code") || hashParams.get("error_code");
    const errorDescription =
      searchParams.get("error_description") ||
      hashParams.get("error_description");

    // Detect specific Supabase authentication errors
    if (
      error === "server_error" &&
      errorCode === "unexpected_failure" &&
      errorDescription?.includes("Database error saving new user")
    ) {
      setAuthError({
        error,
        errorCode,
        errorDescription: errorDescription || "",
      });
    } else if (error && errorCode) {
      setAuthError({
        error,
        errorCode,
        errorDescription: errorDescription || "",
      });
    }
  }, [location]);

  const clearError = () => {
    setAuthError(null);
    // Clean up URL by navigating to login without error params
    navigate("/auth/login", { replace: true });
  };

  const isPermissionError =
    authError?.error === "server_error" &&
    authError?.errorCode === "unexpected_failure" &&
    authError?.errorDescription?.includes("Database error saving new user");

  return {
    authError,
    clearError,
    isPermissionError,
    hasError: !!authError,
  };
};
