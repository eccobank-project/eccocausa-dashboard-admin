import type { LoaderFunctionArgs } from "react-router-dom";

/**
 * Tipo base para middlewares
 */
export type MiddlewareFunction = (
  args: LoaderFunctionArgs
) => Promise<unknown> | unknown;

/**
 * Combina múltiples middlewares en uno solo
 * Ejecuta todos los middlewares en orden y combina sus resultados
 */
export async function combineMiddlewares(
  middlewares: MiddlewareFunction[],
  args: LoaderFunctionArgs
): Promise<Record<string, unknown>> {
  const results: Record<string, unknown> = {};

  for (const middleware of middlewares) {
    try {
      const result = await middleware(args);
      if (result && typeof result === "object") {
        Object.assign(results, result);
      }
    } catch (error) {
      // Si un middleware lanza un redirect u otro error, propagarlo
      throw error;
    }
  }

  return results;
}

/**
 * Helper para crear loaders que usan middlewares
 */
export function createLoaderWithMiddlewares(
  middlewares: MiddlewareFunction[],
  loader?: (
    args: LoaderFunctionArgs & { middlewareData: Record<string, unknown> }
  ) => Promise<unknown>
) {
  return async (args: LoaderFunctionArgs) => {
    // Ejecutar middlewares primero
    const middlewareData = await combineMiddlewares(middlewares, args);

    // Si no hay loader adicional, solo retornar datos de middlewares
    if (!loader) {
      return middlewareData;
    }

    // Ejecutar loader principal con datos de middlewares
    const loaderData = await loader({ ...args, middlewareData });

    return {
      ...middlewareData,
      ...(typeof loaderData === "object" && loaderData
        ? loaderData
        : { data: loaderData }),
    };
  };
}
