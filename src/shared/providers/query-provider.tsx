"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const STALETIME = 50_000;
const CACHE_TIME = 1000 * 60 * 30; // 30 minutos

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Crear QueryClient solo una vez usando useState
  // Esto preserva el caché entre re-renders pero no entre recargas de página
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            staleTime: STALETIME,
            gcTime: CACHE_TIME, // 30 minutos en caché
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
