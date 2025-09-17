"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { initializeGlobalQueryClient } from "@/shared/router/utils/query-loader-utils";

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const ONE_HOUR = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR; // 1 hora
const TWO_HOURS = ONE_HOUR * 2; // 2 horas
const MAX_RETRY_DELAY = 10_000; // 10 segundos
const RETRY_BASE_DELAY = 1000; // 1 segundo
const RETRY_MULTIPLIER = 2;

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Crear QueryClient solo una vez usando useState
  // Esto preserva el caché entre re-renders pero no entre recargas de página
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // No refetch al cambiar de pestaña
            refetchOnReconnect: true, // Solo refetch si se reconecta la red
            staleTime: ONE_HOUR, // Datos frescos por 1 hora por defecto
            gcTime: TWO_HOURS, // 2 horas en caché por defecto
            retry: 2, // Menos reintentos para mejor performance
            retryDelay: (attemptIndex) =>
              Math.min(RETRY_BASE_DELAY * RETRY_MULTIPLIER ** attemptIndex, MAX_RETRY_DELAY),
          },
        },
      })
  );

  // Inicializar el cliente global para uso en loaders
  useEffect(() => {
    initializeGlobalQueryClient(queryClient);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
