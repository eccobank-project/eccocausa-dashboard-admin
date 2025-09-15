export type Sector = {
  id: number;
  nombre: string;
  color: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateSectorRequest = {
  nombre: string;
  color: string;
};

export type UpdateSectorRequest = {
  id: number;
  nombre?: string;
  color?: string;
};

export type SectorFormData = {
  nombre: string;
  color: string;
};

// Para el mapa
export type SectorMapData = Sector & {
  bounds?: google.maps.LatLngBounds;
  polygon?: google.maps.Polygon;
  placeId?: string;
};

// Estados del formulario
export type SectorFormMode = "create" | "edit";

// Colores predefinidos para sectores
export const SECTOR_COLORS = [
  "#FF6B6B", // Rojo
  "#4ECDC4", // Turquesa
  "#45B7D1", // Azul
  "#96CEB4", // Verde
  "#FFEAA7", // Amarillo
  "#DDA0DD", // Violeta
  "#FFB347", // Naranja
  "#98D8C8", // Menta
  "#F7DC6F", // Dorado
  "#BB8FCE", // Lavanda
] as const;

export type SectorColor = (typeof SECTOR_COLORS)[number];
