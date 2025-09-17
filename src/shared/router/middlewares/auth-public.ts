import { type LoaderFunctionArgs, redirect } from "react-router-dom";
import { supabase } from "@/shared/lib/supabase";

/**
 * Middleware para rutas públicas (login, register)
 * Redirige usuarios ya autenticados al dashboard
 */
export async function authPublicMiddleware({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  try {
    // Verificar sesión actual
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error checking session:", error);
      // En caso de error, permitir acceso a rutas públicas
      return { isAuthenticated: false };
    }

    if (session) {
      // Usuario ya autenticado, redireccionar al dashboard
      // Verificar si hay una URL de destino guardada
      const searchParams = new URLSearchParams(url.search);
      const redirectTo = searchParams.get("from") || "/";
      throw redirect(redirectTo);
    }

    // Usuario no autenticado, permitir acceso a rutas públicas
    return {
      isAuthenticated: false,
      allowPublicAccess: true,
    };
  } catch (error) {
    // Si hay error y no es un redirect, permitir acceso público
    if (error instanceof Response) {
      throw error; // Re-throw redirects
    }

    console.error("Public auth middleware error:", error);
    return { isAuthenticated: false };
  }
}

/**
 * Tipo para el retorno del middleware público
 */
export type PublicMiddlewareData = {
  isAuthenticated: false;
  allowPublicAccess?: true;
};
