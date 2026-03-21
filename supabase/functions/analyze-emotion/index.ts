import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── Input Validation ─────────────────────────────────────────
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_URL_LENGTH = 2048;

function validateRequest(body: any): string | null {
  if (!body.description || typeof body.description !== "string") {
    return "La descripción es requerida.";
  }
  if (body.description.trim().length === 0) {
    return "La descripción no puede estar vacía.";
  }
  if (body.description.length > MAX_DESCRIPTION_LENGTH) {
    return `La descripción es demasiado larga. Máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`;
  }

  if (body.photoUrl && typeof body.photoUrl === "string") {
    if (body.photoUrl.length > MAX_URL_LENGTH) {
      return "La URL de la foto es demasiado larga.";
    }
    // Basic URL validation
    if (!body.photoUrl.startsWith("http://") && !body.photoUrl.startsWith("https://") && !body.photoUrl.startsWith("data:image/")) {
      return "URL de foto no válida.";
    }
  }

  if (body.discoveryPercentage !== undefined) {
    const pct = Number(body.discoveryPercentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      return "Porcentaje de descubrimiento debe estar entre 0 y 100.";
    }
  }

  if (!body.userId || typeof body.userId !== "string") {
    return "userId es requerido.";
  }
  // Basic UUID format check
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.userId)) {
    return "userId debe ser un UUID válido.";
  }

  return null;
}

// ── Rate Limiting ────────────────────────────────────────────
async function checkRateLimit(supabase: any, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_user_id: userId,
      p_action: "analyze-emotion",
      p_max_requests: 10,
      p_window_seconds: 60,
    });
    if (error) {
      console.error("Rate limit check error:", error);
      return true; // Fail open
    }
    return data === true;
  } catch (err) {
    console.error("Rate limit exception:", err);
    return true;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Content-Type check ───────────────────────────────────
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "Content-Type debe ser application/json" }),
        { status: 415, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // ── Input validation ─────────────────────────────────────
    const validationError = validateRequest(body);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { description, photoUrl, discoveryPercentage, userId } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY no configurada");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ── Rate limiting ────────────────────────────────────────
    const allowed = await checkRateLimit(supabase, userId);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Límite de solicitudes excedido. Máximo 10 análisis por minuto." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } }
      );
    }

    // Construir mensaje para IA
    const messages: any[] = [
      {
        role: "system",
        content:
          "Eres un experto en detectar emociones. Analiza la descripción y devuelve UNA emoción principal en español en una sola palabra: feliz, nostálgico, energético, melancólico, tranquilo, romántico, o motivado.",
      },
    ];

    if (photoUrl) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: `Descripción: ${description}` },
          { type: "image_url", image_url: { url: photoUrl } },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: `Descripción: ${description}`,
      });
    }

    // Analizar emoción con Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Error de IA:", aiResponse.status, errorText);
      throw new Error("Error al analizar emoción");
    }

    const aiData = await aiResponse.json();
    const emotion = aiData.choices?.[0]?.message?.content?.trim() || "tranquilo";

    // Crear experiencia
    const { data: experienceData, error: expError } = await supabase
      .from("experiences")
      .insert({
        user_id: userId,
        description,
        photo_url: photoUrl,
        emotion_detected: emotion,
      })
      .select()
      .single();

    if (expError) throw expError;

    // Obtener preferencias del usuario
    const { data: preferences } = await supabase
      .from("music_preferences")
      .select("track_name, artist")
      .eq("user_id", userId)
      .eq("liked", true);

    // Generar playlist mock (en producción conectarías con Spotify API)
    const mockTracks = generateMockPlaylist(emotion, discoveryPercentage, preferences || []);

    // Crear playlist
    const { data: playlistData, error: playlistError } = await supabase
      .from("playlists")
      .insert({
        user_id: userId,
        experience_id: experienceData.id,
        name: `Playlist ${emotion}`,
        emotion,
        discovery_percentage: discoveryPercentage,
      })
      .select()
      .single();

    if (playlistError) throw playlistError;

    // Insertar canciones
    const tracksToInsert = mockTracks.map((track) => ({
      playlist_id: playlistData.id,
      track_name: track.name,
      artist: track.artist,
      album: track.album,
      is_new_discovery: track.isNew,
    }));

    const { error: tracksError } = await supabase
      .from("playlist_tracks")
      .insert(tracksToInsert);

    if (tracksError) throw tracksError;

    return new Response(
      JSON.stringify({
        playlistId: playlistData.id,
        emotion,
        tracksCount: mockTracks.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error en analyze-emotion:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Generador de playlist mock
function generateMockPlaylist(
  emotion: string,
  discoveryPercentage: number,
  userPreferences: any[]
) {
  const emotionTracks: Record<string, any[]> = {
    feliz: [
      { name: "Happy", artist: "Pharrell Williams", album: "G I R L" },
      { name: "Walking on Sunshine", artist: "Katrina & The Waves", album: "Walking on Sunshine" },
      { name: "Good Vibrations", artist: "The Beach Boys", album: "Smiley Smile" },
      { name: "Don't Stop Me Now", artist: "Queen", album: "Jazz" },
      { name: "I Feel Good", artist: "James Brown", album: "Out of Sight" },
    ],
    nostálgico: [
      { name: "The Night We Met", artist: "Lord Huron", album: "Strange Trails" },
      { name: "Photograph", artist: "Ed Sheeran", album: "x" },
      { name: "Yesterday", artist: "The Beatles", album: "Help!" },
      { name: "Fix You", artist: "Coldplay", album: "X&Y" },
      { name: "Wonderwall", artist: "Oasis", album: "(What's the Story) Morning Glory?" },
    ],
    energético: [
      { name: "Eye of the Tiger", artist: "Survivor", album: "Eye of the Tiger" },
      { name: "Thunderstruck", artist: "AC/DC", album: "The Razors Edge" },
      { name: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", album: "The Heist" },
      { name: "Stronger", artist: "Kanye West", album: "Graduation" },
      { name: "We Will Rock You", artist: "Queen", album: "News of the World" },
    ],
    melancólico: [
      { name: "Mad World", artist: "Gary Jules", album: "Trading Snakeoil for Wolftickets" },
      { name: "Hurt", artist: "Johnny Cash", album: "American IV: The Man Comes Around" },
      { name: "The Sound of Silence", artist: "Simon & Garfunkel", album: "Sounds of Silence" },
      { name: "Tears in Heaven", artist: "Eric Clapton", album: "Unplugged" },
      { name: "Creep", artist: "Radiohead", album: "Pablo Honey" },
    ],
    tranquilo: [
      { name: "Weightless", artist: "Marconi Union", album: "Weightless" },
      { name: "River Flows in You", artist: "Yiruma", album: "First Love" },
      { name: "Clair de Lune", artist: "Claude Debussy", album: "Suite bergamasque" },
      { name: "Breathe Me", artist: "Sia", album: "Colour the Small One" },
      { name: "Holocene", artist: "Bon Iver", album: "Bon Iver" },
    ],
    romántico: [
      { name: "Perfect", artist: "Ed Sheeran", album: "÷" },
      { name: "All of Me", artist: "John Legend", album: "Love in the Future" },
      { name: "Thinking Out Loud", artist: "Ed Sheeran", album: "x" },
      { name: "Can't Help Falling in Love", artist: "Elvis Presley", album: "Blue Hawaii" },
      { name: "A Thousand Years", artist: "Christina Perri", album: "The Twilight Saga" },
    ],
    motivado: [
      { name: "Lose Yourself", artist: "Eminem", album: "8 Mile Soundtrack" },
      { name: "Hall of Fame", artist: "The Script ft. will.i.am", album: "#3" },
      { name: "Roar", artist: "Katy Perry", album: "Prism" },
      { name: "Titanium", artist: "David Guetta ft. Sia", album: "Nothing but the Beat" },
      { name: "Stronger", artist: "Kelly Clarkson", album: "Stronger" },
    ],
  };

  let tracks = emotionTracks[emotion.toLowerCase()] || emotionTracks.tranquilo;
  
  if (userPreferences.length > 0 && discoveryPercentage < 100) {
    const userTracksCount = Math.floor((tracks.length * (100 - discoveryPercentage)) / 100);
    const randomUserTracks = userPreferences
      .sort(() => Math.random() - 0.5)
      .slice(0, userTracksCount)
      .map((pref) => ({
        name: pref.track_name,
        artist: pref.artist,
        album: "",
        isNew: false,
      }));

    const newTracks = tracks.slice(0, tracks.length - userTracksCount).map((t) => ({
      ...t,
      isNew: true,
    }));

    tracks = [...randomUserTracks, ...newTracks];
  } else {
    tracks = tracks.map((t, i) => ({
      ...t,
      isNew: i < Math.floor((tracks.length * discoveryPercentage) / 100),
    }));
  }

  return tracks.sort(() => Math.random() - 0.5).slice(0, 10);
}
