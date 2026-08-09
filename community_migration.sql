-- Ejecuta este script en el SQL Editor de Supabase (https://supabase.com/dashboard)
-- Ve a tu proyecto > SQL Editor > New Query > pega este script y ejecuta todo junto

-- 1. TABLA DE COMENTARIOS
CREATE TABLE IF NOT EXISTS public.review_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES public.game_reviews(id) ON DELETE CASCADE,
    author_name TEXT DEFAULT 'Anónimo',
    comment_text TEXT NOT NULL,
    community_score NUMERIC(3,1) CHECK (community_score >= 0 AND community_score <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. TABLA DE REACCIONES
CREATE TABLE IF NOT EXISTS public.review_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES public.game_reviews(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike', 'love', 'fire')),
    count INTEGER DEFAULT 0,
    UNIQUE(review_id, reaction_type)
);

-- 3. TABLA DE ENCUESTAS
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. TABLA DE OPCIONES DE ENCUESTAS
CREATE TABLE IF NOT EXISTS public.poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    votes INTEGER DEFAULT 0
);

-- PERMISOS PARA ANON (Para que los visitantes puedan leer y votar/comentar)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_reactions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.polls TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.poll_options TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_comments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_reactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.polls TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.poll_options TO authenticated;

-- RLS Y POLÍTICAS (Permitimos todo de forma pública ya que es anónimo por ahora)
ALTER TABLE public.review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;

-- Políticas Comments
CREATE POLICY "Allow public read comments" ON public.review_comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert comments" ON public.review_comments FOR INSERT WITH CHECK (true);

-- Políticas Reactions
CREATE POLICY "Allow public read reactions" ON public.review_reactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert reactions" ON public.review_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update reactions" ON public.review_reactions FOR UPDATE USING (true);

-- Políticas Polls
CREATE POLICY "Allow public read polls" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Allow public insert polls" ON public.polls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update polls" ON public.polls FOR UPDATE USING (true);

-- Políticas Poll Options
CREATE POLICY "Allow public read poll options" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "Allow public insert poll options" ON public.poll_options FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update poll options" ON public.poll_options FOR UPDATE USING (true);
