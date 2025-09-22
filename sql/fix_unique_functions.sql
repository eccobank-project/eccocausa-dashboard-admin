-- Script mejorado para eliminar TODAS las versiones de las funciones
-- Ejecutar este SQL en el SQL Editor de Supabase

-- 1. Eliminar TODAS las versiones existentes de las funciones (con todos los parámetros posibles)
DROP FUNCTION IF EXISTS create_sector_with_geom(TEXT, INTEGER, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_sector_with_geom(TEXT, INTEGER, TEXT, BIGINT, TEXT);
DROP FUNCTION IF EXISTS update_sector_with_geom(INTEGER, TEXT, INTEGER, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS update_sector_with_geom(INTEGER, TEXT, INTEGER, TEXT, BIGINT, TEXT);
DROP FUNCTION IF EXISTS get_sector_with_geom(INTEGER);
DROP FUNCTION IF EXISTS get_all_sectors_with_geom();

-- 2. Verificar que no quedan funciones
SELECT 
    routine_name, 
    routine_type,
    specific_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%sector%geom%'
ORDER BY routine_name;

-- 3. Crear función para crear sectores con geometría (NUEVA Y ÚNICA VERSIÓN)
CREATE FUNCTION create_sector_with_geom(
    p_nombre TEXT,
    p_id_ciudad INTEGER,
    p_color TEXT,
    p_dia_recojo BIGINT,
    p_geom_json TEXT
)
RETURNS TABLE(
    id INTEGER,
    nombre TEXT,
    id_ciudad INTEGER,
    color TEXT,
    dia_recojo BIGINT,
    geom TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_sector RECORD;
BEGIN
    -- Insertar el sector convirtiendo el GeoJSON a geometría PostGIS
    INSERT INTO sector (nombre, id_ciudad, color, dia_recojo, geom)
    VALUES (
        p_nombre,
        p_id_ciudad,
        p_color,
        p_dia_recojo,
        ST_GeomFromGeoJSON(p_geom_json)
    )
    RETURNING * INTO new_sector;
    
    -- Retornar el sector creado con la geometría convertida de vuelta a GeoJSON
    RETURN QUERY
    SELECT 
        new_sector.id,
        new_sector.nombre,
        new_sector.id_ciudad,
        new_sector.color,
        new_sector.dia_recojo,
        ST_AsGeoJSON(new_sector.geom)::TEXT as geom;
END;
$$;

-- 4. Crear función para actualizar sectores con geometría (NUEVA Y ÚNICA VERSIÓN)
CREATE FUNCTION update_sector_with_geom(
    p_id INTEGER,
    p_nombre TEXT DEFAULT NULL,
    p_id_ciudad INTEGER DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_dia_recojo BIGINT DEFAULT NULL,
    p_geom_json TEXT DEFAULT NULL
)
RETURNS TABLE(
    id INTEGER,
    nombre TEXT,
    id_ciudad INTEGER,
    color TEXT,
    dia_recojo BIGINT,
    geom TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    updated_sector RECORD;
BEGIN
    -- Actualizar solo los campos que no son NULL
    UPDATE sector 
    SET 
        nombre = COALESCE(p_nombre, sector.nombre),
        id_ciudad = COALESCE(p_id_ciudad, sector.id_ciudad),
        color = COALESCE(p_color, sector.color),
        dia_recojo = COALESCE(p_dia_recojo, sector.dia_recojo),
        geom = CASE 
            WHEN p_geom_json IS NOT NULL THEN ST_GeomFromGeoJSON(p_geom_json)
            ELSE sector.geom
        END
    WHERE sector.id = p_id
    RETURNING * INTO updated_sector;
    
    -- Verificar que el sector existe
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sector with id % not found', p_id;
    END IF;
    
    -- Retornar el sector actualizado con la geometría convertida de vuelta a GeoJSON
    RETURN QUERY
    SELECT 
        updated_sector.id,
        updated_sector.nombre,
        updated_sector.id_ciudad,
        updated_sector.color,
        updated_sector.dia_recojo,
        ST_AsGeoJSON(updated_sector.geom)::TEXT as geom;
END;
$$;

-- 5. Crear función para obtener un sector con geometría
CREATE FUNCTION get_sector_with_geom(p_sector_id INTEGER)
RETURNS TABLE(
    id INTEGER,
    nombre TEXT,
    id_ciudad INTEGER,
    color TEXT,
    dia_recojo BIGINT,
    geom TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.nombre,
        s.id_ciudad,
        s.color,
        s.dia_recojo,
        CASE 
            WHEN s.geom IS NOT NULL THEN ST_AsGeoJSON(s.geom)::TEXT
            ELSE NULL
        END as geom
    FROM sector s
    WHERE s.id = p_sector_id;
END;
$$;

-- 6. Crear función para obtener todos los sectores con geometría
CREATE FUNCTION get_all_sectors_with_geom()
RETURNS TABLE(
    id INTEGER,
    nombre TEXT,
    id_ciudad INTEGER,
    color TEXT,
    dia_recojo BIGINT,
    geom TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.nombre,
        s.id_ciudad,
        s.color,
        s.dia_recojo,
        CASE 
            WHEN s.geom IS NOT NULL THEN ST_AsGeoJSON(s.geom)::TEXT
            ELSE NULL
        END as geom
    FROM sector s
    ORDER BY s.nombre ASC;
END;
$$;

-- 7. Dar permisos a usuarios autenticados
GRANT EXECUTE ON FUNCTION create_sector_with_geom TO authenticated;
GRANT EXECUTE ON FUNCTION update_sector_with_geom TO authenticated;
GRANT EXECUTE ON FUNCTION get_sector_with_geom TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_sectors_with_geom TO authenticated;

-- 8. Verificación final - debe mostrar exactamente 4 funciones
SELECT 
    routine_name, 
    routine_type,
    specific_name
FROM information_schema.routines 
WHERE routine_name LIKE '%sector%geom%'
ORDER BY routine_name;

-- 9. Test rápido de la función de creación
SELECT 'Funciones creadas correctamente' as status;