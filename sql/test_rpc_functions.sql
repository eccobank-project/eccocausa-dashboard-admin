-- Test script para verificar las funciones RPC
-- Ejecutar este SQL en Supabase para probar

-- Test 1: Verificar que las funciones existen
SELECT 
    routine_name, 
    routine_type 
FROM information_schema.routines 
WHERE routine_name LIKE '%sector%geom%';

-- Test 2: Probar creación básica con geometría simple
SELECT create_sector_with_geom(
    'Sector Test',
    1,
    '#FF0000',
    'lunes',
    '{"type":"Polygon","coordinates":[[[-74.0059,-4.7110],[-74.0059,-4.7100],[-74.0049,-4.7100],[-74.0049,-4.7110],[-74.0059,-4.7110]]]}'
);

-- Test 3: Verificar estructura de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sector'
ORDER BY ordinal_position;