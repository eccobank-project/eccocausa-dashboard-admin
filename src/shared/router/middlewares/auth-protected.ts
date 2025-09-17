import type { Session } from "@supabase/supabase-js";
import { type LoaderFunctionArgs, redirect } from "react-router-dom";
import { supabase } from "@/shared/lib/supabase";

/**
 * Middleware para rutas protegidas
 * Verifica que el usuario esté autenticado antes de acceder a la ruta
 */
export async function authProtectedMiddleware({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  try {
    // Verificar sesión actual
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error checking session:", error);
      throw redirect(`/auth/login?from=${encodeURIComponent(url.pathname)}`);
    }

    if (!session) {
      // Guardar la ruta intentada para redireccionar después del login
      throw redirect(`/auth/login?from=${encodeURIComponent(url.pathname)}`);
    }

    // Usuario autenticado, permitir acceso
    return {
      session,
      user: session.user,
      isAuthenticated: true,
    };
  } catch (error) {
    // Si hay cualquier error, redireccionar a login
    console.error("Auth middleware error:", error);
    throw redirect(`/auth/login?from=${encodeURIComponent(url.pathname)}`);
  }
}

/**
 * Tipo para el retorno del middleware de autenticación
 */
export type AuthMiddlewareData = {
  session: Session;
  user: Session["user"];
  isAuthenticated: true;
};
