import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  try {
    // 1. Iniciar cliente de Supabase con Service Role (necesario para saltar RLS y poder borrar)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Iniciando recolección de noticias...");

    // 2. Borrar todas las noticias viejas (Reset diario)
    const { error: deleteError } = await supabaseClient
      .from("game_news")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Hack para borrar todo

    if (deleteError) {
      console.error("Error al borrar noticias:", deleteError);
      throw deleteError;
    }

    console.log("Noticias antiguas eliminadas.");

    // 3. Descargar el feed RSS convertido a JSON
    // Usamos el feed público de IGN España a través de un conversor gratuito
    const rssUrl = "https://es.ign.com/feed.xml";
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.status !== "ok" || !data.items) {
      throw new Error("No se pudo obtener el feed de noticias.");
    }

    // 4. Formatear las 5 mejores noticias para nuestra base de datos
    const topNews = data.items.slice(0, 5).map((item: any) => {
      // Extraer imagen del thumbnail o content
      let imageUrl = item.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop";
      
      // Limpiar un poco el excerpt de HTML
      let excerpt = item.description || "";
      excerpt = excerpt.replace(/<[^>]*>?/gm, ''); // Quitar tags HTML
      if (excerpt.length > 200) excerpt = excerpt.substring(0, 197) + "...";

      const dateObj = new Date(item.pubDate);
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      const dateStr = dateObj.toLocaleDateString('es-ES', options);

      return {
        title: item.title,
        category: "Noticias",
        date_str: dateStr,
        read_time: "4 min de lectura",
        image_url: imageUrl,
        excerpt: excerpt,
        author: item.author || "PixelCritic Edge Bot"
      };
    });

    // 5. Insertar las nuevas noticias en la base de datos
    const { error: insertError } = await supabaseClient
      .from("game_news")
      .insert(topNews);

    if (insertError) {
      console.error("Error al insertar noticias:", insertError);
      throw insertError;
    }

    console.log("¡5 Noticias nuevas insertadas con éxito!");

    return new Response(
      JSON.stringify({ success: true, message: "Noticias actualizadas." }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Function Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
