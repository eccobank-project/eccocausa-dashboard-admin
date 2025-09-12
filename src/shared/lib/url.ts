/**
 * Get the correct base URL for the current environment
 * This handles the difference between development and production URLs
 */
export const getBaseUrl = (): string => {
  // If we're in development mode (Vite sets NODE_ENV to development)
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_APP_BASE_URL || "http://localhost:5173";
  }

  // If we're in production and have a production URL configured
  if (import.meta.env.VITE_APP_PRODUCTION_URL) {
    return import.meta.env.VITE_APP_PRODUCTION_URL;
  }

  // Fallback to window.location.origin if no production URL is configured
  // This maintains backward compatibility but should be avoided in production
  return window.location.origin;
};

/**
 * Get the redirect URL for OAuth providers
 * @param path - The path to redirect to after authentication (default: "/")
 */
export const getOAuthRedirectUrl = (path = "/"): string => {
  const baseUrl = getBaseUrl();

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};
