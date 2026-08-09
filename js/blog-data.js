import { supabase } from './supabase-config.js';

// Datos estáticos por si falla Supabase o la tabla está vacía
const fallbackBlogPosts = [
    {
        title: "El diseño de niveles en Souls-likes",
        author: "PixelCritic Editor",
        date_str: "10 Ago 2026",
        image_url: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop",
        summary: "Un análisis profundo sobre cómo FromSoftware utiliza la verticalidad y los atajos para crear mundos interconectados inolvidables.",
        full_text: "El diseño de niveles es un arte..."
    },
    {
        title: "¿Es el formato episódico el futuro de los JRPG?",
        author: "Comunidad",
        date_str: "05 Ago 2026",
        image_url: "https://images.unsplash.com/photo-1552820728-8b83bb6b7738?q=80&w=800&auto=format&fit=crop",
        summary: "Debatimos si dividir grandes historias de rol en partes separadas beneficia a la narrativa o solo perjudica al consumidor.",
        full_text: "Con el éxito reciente de varios remakes..."
    }
];

export async function fetchBlogPosts() {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error("Error al obtener blog_posts de Supabase:", error);
            return fallbackBlogPosts;
        }
        
        if (!data || data.length === 0) {
            return fallbackBlogPosts;
        }
        
        return data;
    } catch (err) {
        console.error("Excepción al obtener blog_posts:", err);
        return fallbackBlogPosts;
    }
}

export async function renderBlogGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Mostrar estado de carga
    container.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <i class="fa-solid fa-spinner fa-spin text-3xl mb-4 text-gaming-accent"></i>
            <p>Cargando artículos...</p>
        </div>
    `;

    const posts = await fetchBlogPosts();
    container.innerHTML = '';
    
    if (posts.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-400">No hay artículos publicados aún.</p>';
        return;
    }

    posts.forEach((post, index) => {
        // Artículo destacado (el primero) ocupa más espacio
        const isFeatured = index === 0;
        
        const card = document.createElement('article');
        card.className = `glass-panel rounded-xl overflow-hidden hover-card transition-all cursor-pointer group ${isFeatured ? 'md:col-span-2 md:flex' : 'flex flex-col'}`;
        
        // Simular evento click para leer artículo (se puede expandir luego)
        card.onclick = () => alert(`Leyendo artículo: ${post.title}\n\nPróximamente agregaremos la página completa para leer el blog.`);

        card.innerHTML = `
            <div class="${isFeatured ? 'md:w-1/2 w-full h-64 md:h-auto' : 'h-48 w-full'} relative overflow-hidden">
                <img src="${post.image_url}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
            </div>
            <div class="${isFeatured ? 'md:w-1/2 p-8 flex flex-col justify-center' : 'p-6 flex flex-col flex-grow'} relative z-10">
                <div class="flex items-center gap-2 mb-3 text-xs font-medium text-gaming-accent">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${post.date_str}</span>
                    <span class="text-gray-600 px-1">•</span>
                    <i class="fa-solid fa-user-pen"></i>
                    <span>${post.author}</span>
                </div>
                <h3 class="${isFeatured ? 'text-2xl md:text-3xl mb-4' : 'text-xl mb-3'} font-display font-bold text-white group-hover:text-gaming-accent transition-colors">
                    ${post.title}
                </h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
                    ${post.summary}
                </p>
                <div class="mt-auto pt-4 border-t border-gray-700/50 flex justify-between items-center text-sm">
                    <span class="text-gray-300 font-medium group-hover:text-white transition-colors">Leer Artículo</span>
                    <i class="fa-solid fa-arrow-right text-gaming-accent transform group-hover:translate-x-1 transition-transform"></i>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}
