-- Ejecuta este script en el SQL Editor de Supabase (https://supabase.com/dashboard)
-- Ve a tu proyecto > SQL Editor > New Query > pega este script y ejecuta

-- Agregar las nuevas columnas para las Reseñas del Editor
ALTER TABLE public.game_reviews 
    ADD COLUMN IF NOT EXISTS author_id TEXT,
    ADD COLUMN IF NOT EXISTS hours_played INTEGER,
    ADD COLUMN IF NOT EXISTS screenshots TEXT;  -- Almacenado como JSON array string

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'game_reviews' 
ORDER BY ordinal_position;
