/** biome-ignore-all lint/a11y/noSvgWithoutTitle: svg elements */
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useOAuth } from "@/shared/hooks/use-oauth";
import { getOAuthRedirectUrl } from "@/shared/lib/url";
import { GoogleIcon } from "../components/eccobank-logo";

type LocationState = {
  from?: {
    pathname: string;
  };
};

const LoginView = () => {
  const [error, setError] = useState<string>("");
  const location = useLocation();

  // Get the intended destination from location state, default to "/"
  const from = (location.state as LocationState)?.from?.pathname || "/";

  const { loading, signInWithOAuth } = useOAuth({
    redirectTo: getOAuthRedirectUrl(from),
    onError: setError,
    onSuccess: () => {
      // OAuth success will be handled by redirect
    },
  });

  const handleGoogleLogin = async () => {
    setError("");
    await signInWithOAuth("google");
  };

  return (
    <div className="w-full">
      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-medium text-destructive text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-2xl text-foreground">Acceso al Sistema</h1>
        <p className="text-muted-foreground">Inicia sesión con tu cuenta corporativa autorizada</p>
      </div>

      {/* Authentication Method */}
      <div className="space-y-6">
        {/* Single Sign-On Section */}
        <div className="space-y-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="px-3 font-medium text-muted-foreground text-xs">AUTENTICACIÓN CORPORATIVA</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            className="group relative w-full overflow-hidden rounded-xl border-2 border-border bg-card px-6 py-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            onClick={handleGoogleLogin}
            type="button"
          >
            {/* Hover effect */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-center justify-center gap-4">
              <div className="flex-shrink-0">
                <GoogleIcon />
              </div>
              <div className="flex-1 text-center">
                <span className="font-semibold text-foreground text-lg">
                  {loading ? "Autenticando..." : "Iniciar sesión con Google"}
                </span>
                <div className="mt-1 text-muted-foreground text-xs">Utiliza tu cuenta corporativa de Google</div>
              </div>
              {loading && (
                <div className="flex-shrink-0">
                  <div className="h-5 w-5 animate-spin rounded-full border-primary border-b-2" />
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Access Information */}
        <div className="space-y-4 rounded-xl bg-muted/30 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Acceso Autorizado</h3>
              <p className="text-muted-foreground text-xs">Solo personal autorizado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Dashboard administrativo completo</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Gestión de operaciones en tiempo real</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Reportes y análisis avanzados</span>
            </div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="border-border border-t pt-4">
          <div className="space-y-3 text-center">
            <p className="text-muted-foreground text-xs leading-relaxed">
              Al acceder al sistema, confirmas que eres un usuario autorizado y aceptas cumplir con las{" "}
              <a className="font-medium text-primary underline hover:text-primary/80" href="/">
                políticas de seguridad corporativa
              </a>{" "}
              y{" "}
              <a className="font-medium text-primary underline hover:text-primary/80" href="/">
                términos de uso
              </a>
              .
            </p>

            <div className="flex items-center justify-center gap-4 pt-2 text-muted-foreground text-xs">
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    fillRule="evenodd"
                  />
                </svg>
                GDPR Compliant
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586l7.293-7.293a1 1 0 011.414 0z"
                    fillRule="evenodd"
                  />
                </svg>
                ISO 27001
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Support Link */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground text-sm">
          ¿Problemas de acceso?{" "}
          <a className="font-medium text-primary hover:text-primary/80" href="/">
            Contactar soporte técnico
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
