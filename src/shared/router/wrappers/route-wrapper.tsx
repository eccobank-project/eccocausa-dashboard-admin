import { type ReactNode, Suspense } from "react";

type RouteWrapperProps = {
  children: ReactNode;
  fallback: ReactNode;
};

/**
 * Wrapper que combina Suspense para rutas
 * Mantiene el archivo de rutas limpio
 */
export function RouteWrapper({ children, fallback }: RouteWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
