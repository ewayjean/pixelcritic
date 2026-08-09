import { supabase } from './supabase-config.js';

// Fallback news data if Supabase table is empty or uninitialized
export const fallbackNewsData = [
    {
        id: 'news-1',
        title: 'Anunciada la secuela de Elden Ring: Revelaciones del primer teaser',
        category: 'Lanzamientos',
        date_str: '05 Ago 2026',
        read_time: '4 min de lectura',
        image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800',
        excerpt: 'FromSoftware sorprende a la comunidad gamer en la Gamescom con un adelanto espectacular que promete expandir las Tierras Intermedias.',
        author: 'Redaccin PixelCritique'
    },
    {
        id: 'news-2',
        title: 'Nvidia presenta la nueva arquitectura de GPUs para juegos a 240 FPS en 4K',
        category: 'Hardware',
        date_str: '03 Ago 2026',
        read_time: '5 min de lectura',
        image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
        excerpt: 'La tecnologa DLSS 4.0 impulsada por inteligencia artificial generativa promete duplicar el rendimiento sin perder fidelidad visual.',
        author: 'Tech Lab'
    }
];

export async function renderNewsGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let newsDataToRender = [];

    try {
        const { data, error } = await supabase
            .from('game_news')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
            newsDataToRender = data;
        } else {
            newsDataToRender = fallbackNewsData;
        }
    } catch (err) {
        console.error("Error fetching news from Supabase:", err);
        newsDataToRender = fallbackNewsData;
    }

    container.innerHTML = newsDataToRender.map(item => `
        <article class="glass-panel rounded-xl overflow-hidden shadow-lg group hover:border-gray-500 transition-all duration-300 flex flex-col h-full">
            <div class="relative h-48 overflow-hidden">
                <div class="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                <img src="${item.image_url}" alt="${item.title}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://placehold.co/800x400/1e293b/3b82f6?text=Noticias+Gaming'">
                <div class="absolute top-3 left-3 z-10">
                    <span class="px-3 py-1 bg-gaming-accent/90 text-white text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-md shadow-md">${item.category}</span>
                </div>
            </div>
            <div class="p-6 flex-grow flex flex-col">
                <div class="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span><i class="fa-regular font-normal fa-calendar-alt mr-1"></i> ${item.date_str}</span>
                    <span><i class="fa-regular font-normal fa-clock mr-1"></i> ${item.read_time || '3 min de lectura'}</span>
                </div>
                <h3 class="text-xl font-bold text-white mb-3 group-hover:text-gaming-accent transition-colors font-sans line-clamp-2">${item.title}</h3>
                <p class="text-gray-300 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">${item.excerpt}</p>
                <div class="pt-4 border-t border-gray-700/50 flex items-center justify-between mt-auto">
                    <span class="text-xs text-gray-400 font-medium">${item.author}</span>
                    <button onclick="showAlert('${item.title.replace(/'/g, "\\'")}', '${item.excerpt.replace(/'/g, "\\'")}\\n\\n(Noticia completa en desarrollo)', 'info')" class="text-xs font-bold text-gaming-accent hover:text-blue-400 transition-colors flex items-center gap-1">
                        Leer mǭs <i class="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}
