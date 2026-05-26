import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* eslint-disable @typescript-eslint/no-explicit-any */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

  return null;
}

function jsonResponse(payload: Record<string, unknown>, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, ...extraHeaders, "Content-Type": "application/json" },
  });
}

type AuthContext = {
  client: any | null;
  userId: string | null;
};

async function getAuthContext(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return { client: null, userId: null };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase anon env missing; treating request as anonymous.");
    return { client: null, userId: null };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return { client: null, userId: null };

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  try {
    const { data, error } = await client.auth.getClaims(token);
    if (error || !data?.claims?.sub) {
      console.warn("Invalid user JWT; treating request as anonymous.");
      return { client: null, userId: null };
    }
    return { client, userId: data.claims.sub as string };
  } catch (authError) {
    console.warn("Auth claim verification failed; treating request as anonymous:", authError);
    return { client: null, userId: null };
  }
}

function normalizeEmotion(value: string | null | undefined, fallback: string): string {
  const text = String(value || "").toLowerCase().trim();
  const aliases: Record<string, string> = {
    feliz: "feliz",
    felicidad: "feliz",
    alegre: "feliz",
    nostálgico: "nostálgico",
    nostalgico: "nostálgico",
    nostalgia: "nostálgico",
    energético: "energético",
    energetico: "energético",
    energia: "energético",
    melancólico: "melancólico",
    melancolico: "melancólico",
    triste: "melancólico",
    tranquilo: "tranquilo",
    calma: "tranquilo",
    romántico: "romántico",
    romantico: "romántico",
    amor: "romántico",
    motivado: "motivado",
    motivación: "motivado",
    motivacion: "motivado",
  };

  for (const [needle, emotion] of Object.entries(aliases)) {
    if (text.includes(needle)) return emotion;
  }
  return fallback;
}

function fallbackEmotion(description: string): string {
  const text = description.toLowerCase();

  const rules: Array<{ emotion: string; words: string[] }> = [
    { emotion: "romántico", words: ["amor", "enamorado", "beso", "cita", "pareja", "romántico", "romantico"] },
    { emotion: "nostálgico", words: ["extraño", "recuerdo", "antes", "pasado", "nostalgia", "nostálgico", "nostalgico"] },
    { emotion: "melancólico", words: ["triste", "llor", "dolor", "adiós", "adios", "perdí", "perdi"] },
    { emotion: "motivado", words: ["logré", "logre", "gym", "entren", "trabajo", "meta", "gané", "gane", "éxito", "exito"] },
    { emotion: "energético", words: ["fiesta", "bail", "concierto", "euforia", "energ", "noche"] },
    { emotion: "feliz", words: ["feliz", "alegr", "risa", "sonrisa", "vacaciones", "amigos"] },
    { emotion: "tranquilo", words: ["calma", "paz", "relax", "tranquilo", "café", "cafe", "playa"] },
  ];

  let best = { emotion: "tranquilo", score: 0 };
  for (const rule of rules) {
    const score = rule.words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
    if (score > best.score) best = { emotion: rule.emotion, score };
  }

  return best.emotion;
}

// ── Rate Limiting ────────────────────────────────────────────
async function checkRateLimit(supabase: any, userId: string): Promise<{ allowed: boolean; unavailable: boolean }> {
  if (!supabase || !userId) return { allowed: false, unavailable: true };
  try {
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_user_id: userId,
      p_action: "analyze-emotion",
      p_max_requests: 10,
      p_window_seconds: 60,
    });
    if (error) {
      console.error("Rate limit check error:", error);
      return { allowed: false, unavailable: true };
    }
    return { allowed: data === true, unavailable: false };
  } catch (err) {
    console.error("Rate limit exception:", err);
    return { allowed: false, unavailable: true };
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
      return jsonResponse({ error: "Content-Type debe ser application/json" }, 415);
    }

    // ── Authentication: only a JWT verified with the Supabase anon key can
    // reach rate limiting, database writes, or paid AI. Anonymous/demo traffic
    // remains supported by the deterministic local fallback below.
    const { client: authClient, userId } = await getAuthContext(req);

    const body = await req.json();

    // ── Input validation ─────────────────────────────────────
    const validationError = validateRequest(body);
    if (validationError) {
      return jsonResponse({ error: validationError }, 400);
    }

    const { description, photoUrl, discoveryPercentage } = body;
    const discovery = Number.isFinite(Number(discoveryPercentage)) ? Number(discoveryPercentage) : 50;
    let emotion = fallbackEmotion(description);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Use the JWT-scoped client so RLS protects writes/reads when authenticated.
    const supabase = authClient;

    // ── Rate limiting ────────────────────────────────────────
    if (userId) {
      const rateLimit = await checkRateLimit(supabase, userId);
      if (rateLimit.unavailable) {
        const tracks = generateMockPlaylist(emotion, discovery, []);
        return jsonResponse({
          playlistId: `local-${Date.now()}`,
          emotion,
          tracksCount: tracks.length,
          tracks,
          warning: "rate_limit_unavailable",
        });
      }
      if (!rateLimit.allowed) {
        return jsonResponse(
          { error: "Límite de solicitudes excedido. Máximo 10 análisis por minuto." },
          429,
          { "Retry-After": "60" }
        );
      }
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

    if (userId && LOVABLE_API_KEY) {
      try {
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
        } else {
          const aiData = await aiResponse.json();
          emotion = normalizeEmotion(aiData.choices?.[0]?.message?.content?.trim(), emotion);
        }
      } catch (aiError) {
        console.error("Excepción de IA, usando fallback:", aiError);
      }
    } else {
      console.warn(userId ? "LOVABLE_API_KEY no configurada; usando detector local de emoción." : "Anonymous request; using local emotion detector.");
    }

    // Anonymous or unconfigured Supabase flows still need to work for Memory Playlist.
    // Return a complete deterministic payload without attempting RLS-protected writes.
    if (!userId || !supabase) {
      const tracks = generateMockPlaylist(emotion, discovery, []);
      return jsonResponse({
        playlistId: `local-${Date.now()}`,
        emotion,
        tracksCount: tracks.length,
        tracks,
        warning: userId ? "database_unavailable" : "anonymous_fallback",
      });
    }

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

    if (expError) {
      console.error("Experience insert failed; returning fallback playlist:", expError);
      const tracks = generateMockPlaylist(emotion, discovery, []);
      return jsonResponse({ playlistId: `local-${Date.now()}`, emotion, tracksCount: tracks.length, tracks, warning: "database_fallback" });
    }

    // Obtener preferencias del usuario
    const { data: preferences } = await supabase
      .from("music_preferences")
      .select("track_name, artist")
      .eq("user_id", userId)
      .eq("liked", true);

    // Generar playlist mock (en producción conectarías con Spotify API)
    const mockTracks = generateMockPlaylist(emotion, discovery, preferences || []);

    // Crear playlist
    const { data: playlistData, error: playlistError } = await supabase
      .from("playlists")
      .insert({
        user_id: userId,
        experience_id: experienceData.id,
        name: `Playlist ${emotion}`,
        emotion,
        discovery_percentage: discovery,
      })
      .select()
      .single();

    if (playlistError) {
      console.error("Playlist insert failed; returning fallback playlist:", playlistError);
      return jsonResponse({ playlistId: `local-${Date.now()}`, emotion, tracksCount: mockTracks.length, tracks: mockTracks, warning: "database_fallback" });
    }

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

    if (tracksError) console.error("Playlist track insert failed; returning playlist without persisted tracks:", tracksError);

    return jsonResponse({
        playlistId: playlistData.id,
        emotion,
        tracksCount: mockTracks.length,
      });
  } catch (error: any) {
    console.error("Error en analyze-emotion:", error);
    const emotion = fallbackEmotion("calma");
    const tracks = generateMockPlaylist(emotion, 50, []);
    return jsonResponse({ playlistId: `local-${Date.now()}`, emotion, tracksCount: tracks.length, tracks, warning: "server_fallback" });
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
    const userTracks = userPreferences
      .map((pref) => ({
        pref,
        order: hashString(`${emotion}:${discoveryPercentage}:${pref.track_name}:${pref.artist}`),
      }))
      .sort((a, b) => a.order - b.order)
      .slice(0, userTracksCount)
      .map(({ pref }) => ({
        name: pref.track_name,
        artist: pref.artist,
        album: "",
        isNew: false,
      }));

    const newTracks = tracks.slice(0, tracks.length - userTracksCount).map((t) => ({
      ...t,
      isNew: true,
    }));

    tracks = [...userTracks, ...newTracks];
  } else {
    tracks = tracks.map((t, i) => ({
      ...t,
      isNew: i < Math.floor((tracks.length * discoveryPercentage) / 100),
    }));
  }

  return tracks
    .map((track) => ({
      track,
      order: hashString(`${emotion}:${discoveryPercentage}:${track.name}:${track.artist}`),
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ track }) => track)
    .slice(0, 10);
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}
