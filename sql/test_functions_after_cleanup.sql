-- Test simple para verificar el funcionamiento después de limpiar las funciones
-- Ejecutar DESPUÉS del script clean_and_recreate_functions.sql

-- Test 1: Verificar que solo existe una versión de cada función
SELECT 
    routine_name, 
    routine_type,
    specific_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%sector%geom%'
ORDER BY routine_name;

-- Test 2: Probar la creación de un sector con geometría
SELECT create_sector_with_geom(
    'Sector Test Geom',
    1,
    '#FF0000',
    1::bigint,  -- Lunes (explícitamente como bigint)
    '{"type":"Polygon","coordinates":[[[-74.0059,-4.7110],[-74.0059,-4.7100],[-74.0049,-4.7100],[-74.0049,-4.7110],[-74.0059,-4.7110]]]}'
);

-- Test 3: Verificar que se guardó correctamente
SELECT id, nombre, color, dia_recojo, ST_AsGeoJSON(geom) as geometry_check
FROM sector 
WHERE nombre = 'Sector Test Geom';

-- Test 4: Limpiar el test (opcional)
-- DELETE FROM sector WHERE nombre = 'Sector Test Geom';