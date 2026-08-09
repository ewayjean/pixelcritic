-- Ejecuta este script en el SQL Editor de Supabase
-- Añadimos la columna para guardar el ID del usuario y su avatar en los comentarios

ALTER TABLE public.review_comments 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS author_avatar TEXT;

-- Actualizar las políticas para que solo los usuarios autenticados puedan comentar
DROP POLICY IF EXISTS "Allow public insert comments" ON public.review_comments;

CREATE POLICY "Allow authenticated insert comments" 
ON public.review_comments 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
