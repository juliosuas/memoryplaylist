import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Input Validation ─────────────────────────────────────────
const MAX_PHOTO_BASE64_LENGTH = 15 * 1024 * 1024; // ~10MB after base64 encoding
const MAX_MOOD_LENGTH = 50;
const MAX_MOMENT_LENGTH = 50;
const MAX_TAGS = 20;
const ALLOWED_CONTENT_TYPES = ["application/json"];

function validateRequest(body: any): string | null {
  if (body.photoBase64 && typeof body.photoBase64 === "string") {
    if (body.photoBase64.length > MAX_PHOTO_BASE64_LENGTH) {
      return "La imagen es demasiado grande. Máximo 10 MB.";
    }
    // Validate it looks like a data URL or base64
    if (!body.photoBase64.startsWith("data:image/") && !body.photoBase64.match(/^[A-Za-z0-9+/=]/)) {
      return "Formato de imagen no válido.";
    }
  }

  if (body.selectedMood && typeof body.selectedMood === "string") {
    if (body.selectedMood.length > MAX_MOOD_LENGTH) {
      return "El mood seleccionado es demasiado largo.";
    }
  }

  if (body.selectedMomentType && typeof body.selectedMomentType === "string") {
    if (body.selectedMomentType.length > MAX_MOMENT_LENGTH) {
      return "El tipo de momento es demasiado largo.";
    }
  }

  if (body.selectedTags) {
    if (!Array.isArray(body.selectedTags)) {
      return "Tags debe ser un array.";
    }
    if (body.selectedTags.length > MAX_TAGS) {
      return `Máximo ${MAX_TAGS} tags permitidos.`;
    }
  }

  if (body.newMusicPercentage !== undefined) {
    const pct = Number(body.newMusicPercentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      return "Porcentaje de música nueva debe estar entre 0 y 100.";
    }
  }

  return null;
}

// ── Rate Limiting ────────────────────────────────────────────
async function checkRateLimit(supabase: any, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_user_id: userId,
      p_action: "analyze-photo",
      p_max_requests: 5,
      p_window_seconds: 60,
    });
    if (error) {
      console.error("Rate limit check error:", error);
      return true; // Allow on error (fail open)
    }
    return data === true;
  } catch (err) {
    console.error("Rate limit exception:", err);
    return true;
  }
}

// ── Extract user ID from JWT ─────────────────────────────────
function extractUserId(authHeader: string | null): string | null {
  if (!authHeader) return null;
  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

interface PhotoAnalysis {
  dominantColors: string[];
  lighting: string;
  scene: string;
  mood: string;
  activity: string;
  season: string;
  timeOfDay: string;
  people: string;
  energy: number;
}

function normalizeAnalysis(raw: any): PhotoAnalysis {
  const validValues: Record<string, string[]> = {
    lighting: ["bright", "dim", "golden", "blue-hour", "night", "natural"],
    scene: ["beach", "city", "nature", "indoor", "party", "concert", "sunset", "mountain", "road", "cafe"],
    mood: ["happy", "melancholic", "energetic", "peaceful", "romantic", "nostalgic", "adventurous"],
    activity: ["dancing", "relaxing", "traveling", "celebrating", "reflecting", "socializing", "exploring"],
    season: ["summer", "winter", "autumn", "spring"],
    timeOfDay: ["morning", "afternoon", "evening", "night"],
    people: ["solo", "couple", "group", "crowd", "none"],
  };

  const defaults: Record<string, string> = {
    lighting: "natural",
    scene: "indoor",
    mood: "peaceful",
    activity: "relaxing",
    season: "undefined",
    timeOfDay: "afternoon",
    people: "none",
  };

  const getValid = (key: string, val: any): string => {
    const s = String(val || "").toLowerCase().trim();
    if (!s || s === "undefined" || s === "null") return defaults[key] || s;
    if (validValues[key] && !validValues[key].includes(s)) return defaults[key];
    return s;
  };

  let colors: string[] = [];
  if (Array.isArray(raw.dominantColors)) {
    colors = raw.dominantColors.map((c: any) => String(c).toLowerCase().trim()).filter((c: string) => c && c !== "undefined");
  } else if (typeof raw.dominantColors === "string" && raw.dominantColors.trim() && raw.dominantColors !== "undefined") {
    colors = [raw.dominantColors.toLowerCase().trim()];
  }
  if (colors.length === 0) colors = ["neutral"];

  const energy = Math.max(1, Math.min(10, Math.round(Number(raw.energy) || 5)));

  return {
    dominantColors: colors,
    lighting: getValid("lighting", raw.lighting),
    scene: getValid("scene", raw.scene),
    mood: getValid("mood", raw.mood),
    activity: getValid("activity", raw.activity),
    season: getValid("season", raw.season),
    timeOfDay: getValid("timeOfDay", raw.timeOfDay),
    people: getValid("people", raw.people),
    energy,
  };
}

interface MusicProfile {
  primaryMoods: string[];
  secondaryMoods: string[];
  energyRange: [number, number];
  tempoPreference: string;
  genreHints: string[];
  atmosphereKeywords: string[];
}

function buildMusicProfile(
  photoAnalysis: PhotoAnalysis | null,
  selectedMood: string,
  selectedMomentType: string,
  newMusicPercentage: number
): MusicProfile {
  const profile: MusicProfile = {
    primaryMoods: [selectedMood],
    secondaryMoods: [],
    energyRange: [3, 7],
    tempoPreference: "medium",
    genreHints: [],
    atmosphereKeywords: [],
  };

  const moodMapping: Record<string, { energy: [number, number]; tempo: string; secondary: string[] }> = {
    enamorado: { energy: [4, 7], tempo: "medium", secondary: ["romántico", "feliz"] },
    "nostálgico": { energy: [3, 6], tempo: "slow", secondary: ["reflexivo", "triste"] },
    feliz: { energy: [6, 9], tempo: "upbeat", secondary: ["motivado", "libre"] },
    relajado: { energy: [2, 5], tempo: "slow", secondary: ["tranquilo", "reflexivo"] },
    nervioso: { energy: [5, 8], tempo: "fast", secondary: ["motivado"] },
    triste: { energy: [2, 5], tempo: "slow", secondary: ["nostálgico", "reflexivo"] },
    reflexivo: { energy: [3, 6], tempo: "slow", secondary: ["nostálgico", "relajado"] },
    motivado: { energy: [7, 10], tempo: "fast", secondary: ["feliz", "libre"] },
    esperanzado: { energy: [5, 8], tempo: "medium", secondary: ["feliz", "motivado"] },
    libre: { energy: [6, 9], tempo: "upbeat", secondary: ["feliz", "motivado"] },
  };

  if (moodMapping[selectedMood]) {
    const mapping = moodMapping[selectedMood];
    profile.energyRange = mapping.energy;
    profile.tempoPreference = mapping.tempo;
    profile.secondaryMoods = mapping.secondary;
  }

  const momentMapping: Record<string, { genres: string[]; atmosphere: string[]; energyBoost: number }> = {
    vacaciones: { genres: ["tropical", "indie", "reggaeton"], atmosphere: ["summer", "beach", "freedom"], energyBoost: 1 },
    fiesta: { genres: ["pop", "dance", "reggaeton", "hip-hop"], atmosphere: ["party", "dance", "fun"], energyBoost: 2 },
    tranquilo: { genres: ["lo-fi", "jazz", "acoustic", "ambient"], atmosphere: ["chill", "calm", "peaceful"], energyBoost: -2 },
    despedida: { genres: ["ballad", "rock", "indie"], atmosphere: ["emotional", "bittersweet"], energyBoost: -1 },
    concierto: { genres: ["rock", "alternative", "indie"], atmosphere: ["live", "energy", "crowd"], energyBoost: 2 },
    noche: { genres: ["r&b", "electronic", "indie"], atmosphere: ["night", "urban", "intimate"], energyBoost: 0 },
    inspiracion: { genres: ["classical", "ambient", "instrumental"], atmosphere: ["creative", "focus", "flow"], energyBoost: 0 },
    evento: { genres: ["pop", "dance", "electronic"], atmosphere: ["celebration", "special"], energyBoost: 1 },
  };

  if (momentMapping[selectedMomentType]) {
    const mapping = momentMapping[selectedMomentType];
    profile.genreHints = mapping.genres;
    profile.atmosphereKeywords = mapping.atmosphere;
    profile.energyRange[0] = Math.max(1, profile.energyRange[0] + mapping.energyBoost);
    profile.energyRange[1] = Math.min(10, profile.energyRange[1] + mapping.energyBoost);
  }

  if (photoAnalysis) {
    const visualEnergy = photoAnalysis.energy || 5;
    profile.energyRange[0] = Math.round((profile.energyRange[0] + visualEnergy) / 2);
    profile.energyRange[1] = Math.round((profile.energyRange[1] + visualEnergy) / 2);

    const photoMoodMapping: Record<string, string[]> = {
      happy: ["feliz", "motivado"],
      melancholic: ["nostálgico", "triste"],
      energetic: ["motivado", "libre"],
      peaceful: ["relajado", "reflexivo"],
      romantic: ["enamorado"],
      nostalgic: ["nostálgico"],
      adventurous: ["libre", "motivado"],
    };

    if (photoAnalysis.mood && photoMoodMapping[photoAnalysis.mood]) {
      profile.secondaryMoods.push(...photoMoodMapping[photoAnalysis.mood]);
    }

    const sceneGenreMapping: Record<string, string[]> = {
      beach: ["tropical", "reggae", "chill"],
      city: ["urban", "hip-hop", "electronic"],
      nature: ["folk", "acoustic", "ambient"],
      party: ["dance", "pop", "reggaeton"],
      concert: ["rock", "live", "alternative"],
      sunset: ["chill", "indie", "lo-fi"],
      mountain: ["folk", "acoustic", "epic"],
    };

    if (photoAnalysis.scene && sceneGenreMapping[photoAnalysis.scene]) {
      profile.genreHints.push(...sceneGenreMapping[photoAnalysis.scene]);
    }

    if (photoAnalysis.dominantColors?.includes("warm")) {
      profile.atmosphereKeywords.push("warm", "cozy");
    }
    if (photoAnalysis.dominantColors?.includes("cool")) {
      profile.atmosphereKeywords.push("chill", "calm");
    }
    if (photoAnalysis.lighting === "golden") {
      profile.atmosphereKeywords.push("golden-hour", "dreamy");
    }
    if (photoAnalysis.lighting === "night") {
      profile.atmosphereKeywords.push("nocturnal", "intimate");
    }
    if (photoAnalysis.timeOfDay === "morning") {
      profile.atmosphereKeywords.push("fresh", "hopeful");
    }
    if (photoAnalysis.timeOfDay === "evening") {
      profile.atmosphereKeywords.push("sunset", "reflective");
    }
    if (photoAnalysis.season === "summer") {
      profile.genreHints.push("summer", "tropical");
    }
    if (photoAnalysis.season === "winter") {
      profile.genreHints.push("cozy", "acoustic");
    }
  }

  profile.secondaryMoods = [...new Set(profile.secondaryMoods)].filter(m => m !== selectedMood);
  profile.genreHints = [...new Set(profile.genreHints)];
  profile.atmosphereKeywords = [...new Set(profile.atmosphereKeywords)];

  return profile;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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

    // ── Rate limiting ────────────────────────────────────────
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const userId = extractUserId(req.headers.get("authorization"));
    if (userId) {
      const allowed = await checkRateLimit(supabase, userId);
      if (!allowed) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Máximo 5 análisis por minuto." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } }
        );
      }
    }

    const { photoBase64, selectedMood, selectedMomentType, selectedTags, newMusicPercentage } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    let photoAnalysis: PhotoAnalysis | null = null;
    let aiWarning: string | null = null;

    if (photoBase64 && LOVABLE_API_KEY) {
      console.log("Analizando foto con IA...");

      const analysisPrompt = `Analiza esta imagen y extrae patrones visuales para crear una playlist musical personalizada.

Devuelve SOLO un JSON válido sin markdown ni explicaciones con esta estructura exacta:
{
  "dominantColors": ["warm" o "cool" o "neutral" o "vibrant" o "muted"],
  "lighting": "bright" o "dim" o "golden" o "blue-hour" o "night" o "natural",
  "scene": "beach" o "city" o "nature" o "indoor" o "party" o "concert" o "sunset" o "mountain" o "road" o "cafe",
  "mood": "happy" o "melancholic" o "energetic" o "peaceful" o "romantic" o "nostalgic" o "adventurous",
  "activity": "dancing" o "relaxing" o "traveling" o "celebrating" o "reflecting" o "socializing" o "exploring",
  "season": "summer" o "winter" o "autumn" o "spring" o "undefined",
  "timeOfDay": "morning" o "afternoon" o "evening" o "night",
  "people": "solo" o "couple" o "group" o "crowd" o "none",
  "energy": número del 1 al 10
}

IMPORTANTE: dominantColors DEBE ser un array de strings. energy DEBE ser un número entero.
Analiza colores, iluminación, expresiones, ambiente y contexto visual para determinar cada campo.`;

      // Try with primary model + retries, then fallback model.
      const callModel = async (model: string, attempt: number): Promise<PhotoAnalysis | null> => {
        const controller = new AbortController();
        const timeoutMs = model.includes("pro") ? 30_000 : 20_000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: analysisPrompt },
                    { type: "image_url", image_url: { url: photoBase64 } },
                  ],
                },
              ],
            }),
          });

          if (!aiResponse.ok) {
            const errorText = (await aiResponse.text()).slice(0, 200);
            console.error(`[${model} attempt ${attempt}] AI ${aiResponse.status}: ${errorText}`);
            // Surface 429/402 to the client so it can show a clear message.
            if (aiResponse.status === 429) aiWarning = "ai_rate_limited";
            else if (aiResponse.status === 402) aiWarning = "ai_payment_required";
            else aiWarning = "ai_unavailable";
            return null;
          }

          const aiData = await aiResponse.json();
          const content = aiData.choices?.[0]?.message?.content?.trim() || "";
          console.log(`[${model} attempt ${attempt}] raw:`, content.slice(0, 200));

          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            console.error(`[${model} attempt ${attempt}] no JSON in response`);
            return null;
          }
          const rawAnalysis = JSON.parse(jsonMatch[0]);
          return normalizeAnalysis(rawAnalysis);
        } catch (err: any) {
          const reason = err?.name === "AbortError" ? "timeout" : err?.message || "unknown";
          console.error(`[${model} attempt ${attempt}] fetch failed: ${reason}`);
          return null;
        } finally {
          clearTimeout(timeoutId);
        }
      };

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const backoffs = [500, 1500];
      const primaryModel = "google/gemini-2.5-pro";
      const fallbackModel = "google/gemini-2.5-flash";

      for (let i = 0; i < backoffs.length && !photoAnalysis; i++) {
        if (i > 0) await sleep(backoffs[i - 1]);
        photoAnalysis = await callModel(primaryModel, i + 1);
      }

      if (!photoAnalysis) {
        console.warn("Primary model failed 3x, trying fallback model");
        await sleep(500);
        photoAnalysis = await callModel(fallbackModel, 1);
      }

      if (photoAnalysis) {
        aiWarning = null;
        console.log("Análisis normalizado:", JSON.stringify(photoAnalysis));
      } else {
        console.error("All AI attempts exhausted, returning null analysis");
        if (!aiWarning) aiWarning = "ai_unavailable";
      }
    } else if (photoBase64 && !LOVABLE_API_KEY) {
      console.warn("LOVABLE_API_KEY no configurada; usando perfil musical sin análisis visual IA.");
    }

    const musicProfile = buildMusicProfile(photoAnalysis, selectedMood, selectedMomentType, newMusicPercentage);
    console.log("Perfil musical generado:", JSON.stringify(musicProfile));

    return new Response(
      JSON.stringify({ success: true, photoAnalysis, musicProfile, warning: aiWarning }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error en analyze-photo:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
