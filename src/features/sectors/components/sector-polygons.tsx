import { useCallback, useEffect, useRef } from "react";
import type { Sector } from "../types";
import { convertPostGISToGeoJSON } from "../utils/geometry";

const MAX_OVERVIEW_ZOOM = 15;

type SectorPolygonsProps = {
  sectors: Sector[];
  map: google.maps.Map | null;
  onSectorClick?: (sector: Sector) => void;
};

export const SectorPolygons = ({ sectors, map, onSectorClick }: SectorPolygonsProps) => {
  const polygonsRef = useRef<Map<number, google.maps.Polygon>>(new Map());

  // Limpiar polígonos
  const clearPolygons = useCallback(() => {
    for (const polygon of polygonsRef.current.values()) {
      polygon.setMap(null);
    }
    polygonsRef.current.clear();
  }, []);

  // Crear polígono para un sector
  const createSectorPolygon = useCallback(
    (sector: Sector, googleMap: google.maps.Map) => {
      if (!sector.geom) {
        console.warn(`Sector ${sector.nombre} no tiene geometría`);
        return null;
      }

      // Convertir geometría de PostGIS a GeoJSON
      const geometry = convertPostGISToGeoJSON(sector.geom);
      if (!geometry) {
        console.warn(`No se pudo convertir geometría para sector ${sector.nombre}`);
        return null;
      }

      try {
        const coordinates = geometry.coordinates[0];
        const path: google.maps.LatLng[] = [];

        for (const coord of coordinates) {
          path.push(new window.google.maps.LatLng(coord[1], coord[0])); // lat, lng
        }

        // Crear polígono
        const polygon = new window.google.maps.Polygon({
          paths: path,
          map: googleMap,
          fillColor: sector.color,
          fillOpacity: 0.3,
          strokeColor: sector.color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          clickable: true,
          draggable: false,
          editable: false,
        });

        // Añadir evento click
        polygon.addListener("click", () => {
          console.log(`Click en sector: ${sector.nombre}`);
          onSectorClick?.(sector);
        });

        console.log(`✅ Polígono creado para sector: ${sector.nombre}`);
        return polygon;
      } catch (error) {
        console.error(`Error creando polígono para sector ${sector.nombre}:`, error);
        return null;
      }
    },
    [onSectorClick]
  );

  // Ajustar vista del mapa
  const adjustMapView = useCallback(
    (validPolygons: number, bounds: google.maps.LatLngBounds) => {
      if (!map || validPolygons === 0) {
        return;
      }

      map.fitBounds(bounds);

      // Si hay muchos polígonos, agregar un poco de padding
      if (validPolygons > 1) {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > MAX_OVERVIEW_ZOOM) {
          map.setZoom(MAX_OVERVIEW_ZOOM);
        }
      }
    },
    [map]
  );

  // Crear polígonos para todos los sectores
  const createAllPolygons = useCallback(() => {
    if (!map) {
      return;
    }

    let validPolygons = 0;
    const bounds = new window.google.maps.LatLngBounds();
    let hasBounds = false;

    // Crear polígonos para cada sector
    for (const sector of sectors) {
      const polygon = createSectorPolygon(sector, map);
      if (polygon) {
        polygonsRef.current.set(sector.id, polygon);
        validPolygons++;

        // Añadir al bounds para ajustar vista
        const path = polygon.getPath();
        for (const coord of path.getArray()) {
          bounds.extend(coord);
          hasBounds = true;
        }
      }
    }

    console.log(`Se crearon ${validPolygons} polígonos válidos de ${sectors.length} sectores`);

    // Ajustar vista del mapa
    if (hasBounds) {
      adjustMapView(validPolygons, bounds);
    }
  }, [sectors, map, createSectorPolygon, adjustMapView]);

  // Renderizar todos los polígonos
  const renderPolygons = useCallback(() => {
    if (!map) {
      return;
    }

    if (!sectors.length) {
      clearPolygons();
      return;
    }

    console.log(`Renderizando ${sectors.length} polígonos de sectores`);

    // Limpiar polígonos existentes
    clearPolygons();

    // Crear nuevos polígonos
    createAllPolygons();
  }, [map, sectors, clearPolygons, createAllPolygons]);

  // Effect para renderizar polígonos cuando cambien los sectores o el mapa
  useEffect(() => {
    renderPolygons();
  }, [renderPolygons]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      clearPolygons();
    };
  }, [clearPolygons]);

  // Este componente no renderiza nada directamente
  return null;
};
