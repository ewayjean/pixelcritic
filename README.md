# PixelCritique 🎮

**PixelCritique** es una plataforma web frontend pura (SPA - Single Page Application) diseñada para reseñar videojuegos, explorar noticias del sector e interactuar con una comunidad gamer apasionada.

El proyecto está diseñado para ser desplegado como un sitio estático súper rápido en plataformas como **Vercel**, **Netlify** o **Railway** sin necesidad de procesos de compilación complejos.

---

## 🌟 Características Principales

1. **Catálogo de Reseñas**:
   - Visualización de análisis de juegos con puntuaciones interactivas de 0 a 10.
   - Búsqueda dinámica en tiempo real por título, plataforma o palabras clave.
   - Sistema de autenticación de prueba "Modo Admin / Modo Lector" para publicar y gestionar reseñas.

2. **Sección de Noticias Gaming**:
   - Cuadrícula responsive con las últimas novedades del mundo indie, hardware, lanzamientos y esports.

3. **Sección de Comunidad**:
   - Landing de integración con Discord oficial, llamados a la acción (CTA) y estadísticas en vivo simuladas.

4. **Persistencia en Tiempo Real (Supabase + Fallback Local)**:
   - Conexión directa a **Supabase Database** mediante `@supabase/supabase-js`.
   - Carga remota en tiempo real de reseñas y fallback automático en memoria si no hay conexión.

---

## 🛠️ Stack Tecnológico

- **HTML5**: Estructura semántica, accesible y etiquetas SEO.
- **CSS**: Vanilla CSS con **Tailwind CSS v3 (vía CDN)** para clases utilitarias.
- **JavaScript**: Vanilla JS ES6+ modularizado (`type="module"`).
- **Base de Datos**: Supabase Database (PostgreSQL / REST Client via `@supabase/supabase-js`).
- **Iconos & Fuentes**: Font Awesome 6 & Google Fonts (Orbitron / Inter).

---

## 📁 Estructura del Proyecto

```
PixelCritique/
├── index.html              # Punto de entrada principal (SPA)
├── css/
│   └── styles.css          # Estilos personalizados (glassmorphism, scrollbars, etc.)
├── js/
│   ├── app.js              # Lógica principal, enrutamiento interno, modales y CRUD
│   ├── supabase-config.js  # Cliente de conexión con Supabase
│   └── news-data.js        # Módulo de datos y renderizado para la sección de Noticias
├── insumos/                # Archivos iniciales e instrucciones del proyecto
└── README.md               # Documentación general
```

---

## 🚀 Cómo Ejecutar en Local

No se requiere ningún paso de `npm install` ni `build` complejo.

1. **Usando una extensión de servidor local** (Recomendado):
   - Si usas VS Code, instala la extensión **Live Server**.
   - Haz clic derecho en `index.html` y selecciona **Open with Live Server**.

2. **Usando Node.js / npx**:
   ```bash
   npx serve .
   ```
   Abre la URL proporcionada (ej. `http://localhost:3000`) en tu navegador.

---

## ⚙️ Estructura de la Tabla en Supabase

Para que las reseñas se guarden directamente en tu proyecto de Supabase, crea una tabla llamada `game_reviews` en el **SQL Editor** de Supabase con el siguiente script:

```sql
create table public.game_reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  platforms text not null,
  image_url text not null,
  score numeric not null,
  summary text not null,
  full_text text not null
);

-- Habilitar acceso de lectura y escritura pública para el prototipo
alter table public.game_reviews enable row level security;
create policy "Acceso público lectura" on public.game_reviews for select using (true);
create policy "Acceso público inserción" on public.game_reviews for insert with check (true);
create policy "Acceso público eliminación" on public.game_reviews for delete using (true);
```

---

## 🌐 Despliegue en Vercel / Railway

### Despliegue en Vercel:
1. Sube este repositorio a tu cuenta de **GitHub**.
2. Ve a [Vercel](https://vercel.com/) y haz clic en **Add New > Project**.
3. Importa tu repositorio `PixelCritique`.
4. Selecciona el directorio raíz `./` y haz clic en **Deploy**. ¡Listo!

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia MIT. Creado con pasión por los videojuegos.
