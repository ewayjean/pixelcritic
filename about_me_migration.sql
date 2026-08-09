-- Crear tabla para configuraciones generales del sitio
CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar contenido por defecto para 'about_me'
INSERT INTO site_settings (key, value) VALUES 
    ('about_me', 'Soy un apasionado de los videojuegos desde que tengo memoria. Mi objetivo con PixelCritique es ofrecer análisis sinceros, profundizando en lo que hace que un juego sea especial (o por qué falla en el intento).

No me dejo llevar por el hype; analizo mecánicas, narrativa, arte y rendimiento para darte una perspectiva real antes de que decidas invertir tu tiempo y dinero.'),
    ('about_name', 'Alex Pixel'),
    ('about_role', 'Crítico & Editor Gamer'),
    ('about_image', '');

-- Habilitar RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Permitir a todos leer las configuraciones
CREATE POLICY "Permitir lectura pública de site_settings" 
ON site_settings FOR SELECT 
USING (true);

-- Permitir a todos actualizar (ya que la seguridad de admin actual es frontend-only, pero esto se puede cambiar más adelante)
CREATE POLICY "Permitir actualización pública de site_settings" 
ON site_settings FOR UPDATE 
USING (true);

CREATE POLICY "Permitir inserción pública de site_settings" 
ON site_settings FOR INSERT 
WITH CHECK (true);
