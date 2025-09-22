import type { GeometryData } from "../types";

// Constantes para validación
const MIN_POLYGON_POINTS = 4;
const MIN_COORDINATE_ELEMENTS = 2;
const MIN_LATITUDE = -90;
const MAX_LATITUDE = 90;
const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;
const WGS84_SRID = 4326;

/**
 * Convierte un GeoJSON Polygon a formato PostGIS para almacenar en Supabase
 *
 * @param geometry - Datos de geometría en formato GeoJSON
 * @returns Objeto con la query SQL y parámetros para insertar en PostGIS
 */
export const convertGeoJSONToPostGIS = (geometry: GeometryData) => {
  if (!geometry || geometry.type !== "Polygon") {
    throw new Error("El tipo de geometría debe ser 'Polygon'");
  }

  const coordinates = geometry.coordinates[0];

  if (!coordinates || coordinates.length < MIN_POLYGON_POINTS) {
    throw new Error("Un polígono debe tener al menos 4 coordenadas");
  }

  // Verificar que el polígono esté cerrado (primer punto = último punto)
  const firstPoint = coordinates[0];
  const lastPoint = coordinates.at(-1);

  if (
    !lastPoint ||
    firstPoint[0] !== lastPoint[0] ||
    firstPoint[1] !== lastPoint[1]
  ) {
    throw new Error(
      "El polígono debe estar cerrado (primer punto = último punto)"
    );
  }

  // Convertir coordenadas a formato WKT (Well-Known Text)
  const coordinateStrings = coordinates.map(([lng, lat]) => `${lng} ${lat}`);
  const wkt = `POLYGON((${coordinateStrings.join(", ")}))`;

  return {
    wkt,
    // Para usar con ST_GeomFromText en la query
    geometry_column: `ST_GeomFromText('${wkt}', ${WGS84_SRID})`,
    // GeoJSON object para enviar directamente a Supabase PostGIS
    geojson: geometry,
    // String version si necesitas formato de texto
    geojsonString: JSON.stringify(geometry),
  };
};

/**
 * Convierte datos de PostGIS de vuelta a GeoJSON
 *
 * @param geomData - Datos de geometría de PostGIS
 * @returns Geometría en formato GeoJSON
 */
export const convertPostGISToGeoJSON = (
  geomData: string | object | null
): GeometryData | null => {
  if (!geomData) {
    return null;
  }

  try {
    return parseGeometryData(geomData);
  } catch (error) {
    console.error("Error al parsear datos de geometría:", error);
    return null;
  }
};

/**
 * Helper function para parsear datos de geometría
 */
const parseGeometryData = (geomData: string | object): GeometryData | null => {
  // Si ya es un objeto, intentar usarlo directamente
  if (typeof geomData === "object") {
    return parseObjectGeometry(geomData);
  }

  // Si es string, intentar parsearlo
  if (typeof geomData === "string") {
    return parseStringGeometry(geomData);
  }

  return null;
};

/**
 * Parser para geometría en formato object
 */
const parseObjectGeometry = (geomData: object): GeometryData | null => {
  const data = geomData as Record<string, unknown>;

  // Si es un objeto GeoJSON completo, extraer la geometría
  if (data.type === "Feature" && data.geometry) {
    return data.geometry as GeometryData;
  }

  // Si ya es una geometría
  if (data.type === "Polygon") {
    return geomData as GeometryData;
  }

  return null;
};

/**
 * Parser para geometría en formato string
 */
const parseStringGeometry = (geomData: string): GeometryData | null => {
  const startsWithBrace = geomData.startsWith("{");
  const startsWithBracket = geomData.startsWith("[");

  const isValidJsonStart = startsWithBrace || startsWithBracket;

  if (!isValidJsonStart) {
    return null;
  }

  const parsed = JSON.parse(geomData);

  // Si es un objeto GeoJSON completo, extraer la geometría
  if (parsed.type === "Feature" && parsed.geometry) {
    return parsed.geometry;
  }

  // Si ya es una geometría
  if (parsed.type === "Polygon") {
    return parsed;
  }

  return null;
}; /**
 * Valida coordenadas individuales
 */
const validateCoordinate = (coord: unknown): boolean => {
  if (!Array.isArray(coord) || coord.length !== MIN_COORDINATE_ELEMENTS) {
    return false;
  }

  const [lng, lat] = coord;

  if (typeof lng !== "number" || typeof lat !== "number") {
    return false;
  }

  return (
    lat >= MIN_LATITUDE &&
    lat <= MAX_LATITUDE &&
    lng >= MIN_LONGITUDE &&
    lng <= MAX_LONGITUDE
  );
};

/**
 * Valida que un GeoJSON sea un polígono válido
 *
 * @param geometry - Geometría a validar
 * @returns true si es válido, false en caso contrario
 */
export const validatePolygonGeometry = (geometry: GeometryData): boolean => {
  try {
    if (!geometry || geometry.type !== "Polygon") {
      return false;
    }

    const coordinates = geometry.coordinates;

    if (!coordinates) {
      return false;
    }

    if (!Array.isArray(coordinates)) {
      return false;
    }

    if (coordinates.length === 0) {
      return false;
    }

    // Validar que el primer anillo (exterior) tenga al menos 4 puntos
    const exteriorRing = coordinates[0];

    if (!exteriorRing) {
      return false;
    }

    if (!Array.isArray(exteriorRing)) {
      return false;
    }

    if (exteriorRing.length < MIN_POLYGON_POINTS) {
      return false;
    }

    // Validar cada coordenada
    for (const coord of exteriorRing) {
      if (!validateCoordinate(coord)) {
        return false;
      }
    }

    // Validar que el polígono esté cerrado
    const firstPoint = exteriorRing[0];
    const lastPoint = exteriorRing.at(-1);

    if (
      !lastPoint ||
      firstPoint[0] !== lastPoint[0] ||
      firstPoint[1] !== lastPoint[1]
    ) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validando geometría:", error);
    return false;
  }
};

/**
 * Calcula el centro (centroide) de un polígono
 *
 * @param geometry - Geometría del polígono
 * @returns Coordenadas del centro {lat, lng}
 */
export const getPolygonCenter = (
  geometry: GeometryData
): { lat: number; lng: number } | null => {
  if (!validatePolygonGeometry(geometry)) {
    return null;
  }

  const coordinates = geometry.coordinates[0];
  let totalLat = 0;
  let totalLng = 0;
  let validPoints = 0;

  // Calcular promedio de coordenadas (excluyendo el último punto que es igual al primero)
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lng, lat] = coordinates[i];
    totalLat += lat;
    totalLng += lng;
    validPoints++;
  }

  if (validPoints === 0) {
    return null;
  }

  return {
    lat: totalLat / validPoints,
    lng: totalLng / validPoints,
  };
};
