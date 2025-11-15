export type Sector = {
  id: number;
  nombre: string;
  id_ciudad: number;
  color: string;
  dia_recojo: number; // Cambiado a number para coincidir con BIGINT
  geom: string | GeometryData | null; // Geometry data from PostGIS
};

export type CreateSectorRequest = {
  nombre: string;
  id_ciudad: number;
  color: string;
  dia_recojo: number; // Cambiado a number
  geom?: string | GeometryData | null;
};

export type UpdateSectorRequest = {
  id: number;
  nombre?: string;
  id_ciudad?: number;
  color?: string;
  dia_recojo?: number; // Cambiado a number
  geom?: string | GeometryData | null;
};

export type SectorFormData = {
  nombre: string;
  id_ciudad: number;
  color: string;
  dia_recojo: number; // Cambiado a number para coincidir con la base de datos
};

// Para el mapa
export type SectorMapData = Sector & {
  bounds?: google.maps.LatLngBounds;
  polygon?: google.maps.Polygon;
  placeId?: string;
};

// Estados del formulario
export type SectorFormMode = "create" | "edit";

// Días de la semana para dia_recojo - mapeados a números
export const DIAS_SEMANA = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
] as const;

export type DiaSemana = (typeof DIAS_SEMANA)[number]["value"];

// Funciones de utilidad para convertir entre números y nombres de días
export const getDiaNombre = (diaNumero: number): string => {
  const dia = DIAS_SEMANA.find((d) => d.value === diaNumero);
  return dia?.label || "Día desconocido";
};

export const getDiaNumero = (diaNombre: string): number => {
  const dia = DIAS_SEMANA.find(
    (d) => d.label.toLowerCase() === diaNombre.toLowerCase()
  );
  return dia?.value || 1;
};

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
