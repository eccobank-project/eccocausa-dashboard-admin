export type Sector = {
  id: number;
  nombre: string;
  id_ciudad: number;
  color: string;
  dia_recojo: string;
  geom: string | null; // Geometry data from PostGIS
  created_at?: string;
  updated_at?: string;
};

export type CreateSectorRequest = {
  nombre: string;
  id_ciudad: number;
  color: string;
  dia_recojo: string;
  geom?: string | null;
};

export type UpdateSectorRequest = {
  id: number;
  nombre?: string;
  id_ciudad?: number;
  color?: string;
  dia_recojo?: string;
  geom?: string | null;
};

export type SectorFormData = {
  nombre: string;
  id_ciudad: number;
  color: string;
  dia_recojo: string;
};

// Para el mapa
export type SectorMapData = Sector & {
  bounds?: google.maps.LatLngBounds;
  polygon?: google.maps.Polygon;
  placeId?: string;
};

// Estados del formulario
export type SectorFormMode = "create" | "edit";

// Días de la semana para dia_recojo
export const DIAS_SEMANA = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miércoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sábado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
] as const;

export type DiaSemana = (typeof DIAS_SEMANA)[number]["value"];

// Tipo para datos de geometría ParsedGeometry
export type GeometryData = {
  type: "Polygon";
  coordinates: number[][][]; // Array de coordenadas [lng, lat]
};

// Tipo para mostrar en tabla (sin geom para performance)
export type SectorTableView = Omit<Sector, "geom"> & {
  ciudad_nombre?: string; // Si queremos mostrar el nombre de la ciudad
};

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
