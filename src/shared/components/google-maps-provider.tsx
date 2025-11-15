/** biome-ignore-all lint/style/noExportedImports: no lint */
import type { Libraries } from "@googlemaps/js-api-loader";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import type React from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Librerías combinadas que necesitan todos los componentes
const COMBINED_LIBRARIES: Libraries = ["places", "drawing", "geometry"];

type GoogleMapsProviderProps = {
  children: (status: Status) => React.ReactElement;
};

/**
 * Proveedor centralizado de Google Maps que carga todas las librerías necesarias
 * Esto evita conflictos cuando diferentes componentes necesitan librerías diferentes
 */
export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return children(Status.FAILURE);
  }

  return <Wrapper apiKey={GOOGLE_MAPS_API_KEY} libraries={COMBINED_LIBRARIES} render={children} />;
};

// Re-export Status as value
export { Status };
