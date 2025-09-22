/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <links to relevant documentation or resources> */
import { useAuthError } from "@/shared/hooks/use-auth-error";
import { AuthProvider } from "@/shared/providers/auth-provider";
import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const { isPermissionError } = useAuthError();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're not already on the error page and we have a permission error
    if (isPermissionError && location.pathname !== "/auth/error") {
      navigate("/auth/error", { replace: true });
    }
  }, [isPermissionError, navigate, location.pathname]);

  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
          </div>
        }
      >
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg space-y-8">
            {/* Header with Logo and Company Info */}
            {/* <div className="text-center space-y-6">
              <div className="flex justify-center">
                <EccoBankLogo className="scale-110" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">Sistema Administrativo</h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Plataforma segura para la gestión integral de operaciones de reciclaje
                </p>
              </div>
            </div> */}

            {/* Main Content Card */}
            <div className="relative">
              {/* Enhanced background with subtle pattern */}
              <div className="absolute inset-0 rounded-2xl border border-border bg-card shadow-2xl" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

              <div className="relative p-8">
                <Outlet />
              </div>
            </div>

            {/* Security Footer - More Professional */}
            <div className="space-y-4">
              {/* Security indicators */}
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-8 text-muted-foreground text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-medium">Conexión Segura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        fillRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">Encriptado 256-bit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        fillRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">Certificado SOC 2</span>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-center">
                <p className="text-muted-foreground/60 text-xs">
                  © 2025 Eccocausa. Todos los derechos reservados. | Versión 2.1.0
                </p>
              </div>
            </div>
          </div>
        </main>
      </Suspense>
    </AuthProvider>
  );
};

export default AuthLayout;
