/**
 * Photo analysis client with retries, timeout and clear error codes.
 *
 * Calls the `analyze-photo` edge function directly via fetch instead of
 * `supabase.functions.invoke` so it works even if the Supabase client
 * module fails to initialize (missing VITE_SUPABASE_URL in the bundle).
 */

export type PhotoAnalysisErrorCode =
  | "missing_config"
  | "offline"
  | "timeout"
  | "rate_limited"
  | "payment_required"
  | "server_error"
  | "bad_request"
  | "unknown";

export interface PhotoAnalysisPayload {
  photoBase64: string;
  selectedMood: string;
  selectedMomentType: string;
  selectedTags: Array<{ type: "artist" | "song"; value: string; label: string }>;
  newMusicPercentage: number;
}

export interface PhotoAnalysisData {
  success: boolean;
  photoAnalysis: Record<string, unknown> | null;
  musicProfile: Record<string, unknown> | null;
  warning: string | null;
}

export interface PhotoAnalysisResult {
  data: PhotoAnalysisData | null;
  error: PhotoAnalysisErrorCode | null;
  attempts: number;
}

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? "";

const ENDPOINT = SUPABASE_URL
  ? `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/analyze-photo`
  : "";

// Keep the product responsive even when the Supabase project is paused or
// the Edge Function/Gateway is unavailable. One short remote attempt is enough;
// the deterministic local analyzer below is the guaranteed happy path.
const REQUEST_TIMEOUT_MS = 8_000;
const BACKOFFS = [0];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function clampEnergy(value: number): number {
  return Math.max(1, Math.min(10, Math.round(value || 5)));
}

function buildLocalMusicProfile(
  photoAnalysis: Record<string, unknown> | null,
  selectedMood: string,
  selectedMomentType: string,
  newMusicPercentage: number
): Record<string, unknown> {
  const moodEnergy: Record<string, [number, number]> = {
    enamorado: [4, 7],
    "nostálgico": [3, 6],
    feliz: [6, 9],
    relajado: [2, 5],
    nervioso: [5, 8],
    triste: [2, 5],
    reflexivo: [3, 6],
    motivado: [7, 10],
    rapero: [7, 10],
    esperanzado: [5, 8],
    libre: [6, 9],
  };

  const momentGenres: Record<string, string[]> = {
    vacaciones: ["tropical", "indie", "reggaeton"],
    fiesta: ["pop", "dance", "reggaeton", "hip-hop"],
    tranquilo: ["lo-fi", "acoustic", "ambient"],
    despedida: ["ballad", "rock", "indie"],
    concierto: ["rock", "alternative", "indie"],
    noche: ["r&b", "electronic", "indie"],
    inspiracion: ["ambient", "instrumental"],
    evento: ["pop", "dance", "electronic"],
  };

  const photoMoodToSecondary: Record<string, string[]> = {
    happy: ["feliz", "motivado"],
    melancholic: ["nostálgico", "triste"],
    energetic: ["motivado", "libre"],
    peaceful: ["relajado", "reflexivo"],
    romantic: ["enamorado"],
    nostalgic: ["nostálgico"],
    adventurous: ["libre", "motivado"],
  };

  const baseRange = moodEnergy[selectedMood] ?? [3, 7];
  const visualEnergy = clampEnergy(Number(photoAnalysis?.energy ?? 5));
  const energyRange: [number, number] = [
    Math.max(1, Math.round((baseRange[0] + visualEnergy) / 2)),
    Math.min(10, Math.round((baseRange[1] + visualEnergy) / 2)),
  ];

  const secondary = [
    ...(photoAnalysis?.mood ? photoMoodToSecondary[String(photoAnalysis.mood)] ?? [] : []),
  ].filter((m) => m && m !== selectedMood);

  return {
    primaryMoods: selectedMood ? [selectedMood] : [],
    secondaryMoods: [...new Set(secondary)],
    energyRange,
    tempoPreference: visualEnergy >= 7 ? "fast" : visualEnergy <= 3 ? "slow" : "medium",
    genreHints: [...new Set(momentGenres[selectedMomentType] ?? [])],
    atmosphereKeywords: [photoAnalysis?.lighting, photoAnalysis?.scene, photoAnalysis?.timeOfDay].filter(Boolean),
    discoveryLevel: newMusicPercentage,
  };
}

export async function analyzePhotoLocally(payload: PhotoAnalysisPayload): Promise<PhotoAnalysisData> {
  const fallback = () => {
    const moodFromSelected: Record<string, string> = {
      enamorado: "romantic",
      "nostálgico": "nostalgic",
      feliz: "happy",
      relajado: "peaceful",
      nervioso: "energetic",
      triste: "melancholic",
      reflexivo: "peaceful",
      motivado: "energetic",
      rapero: "energetic",
      esperanzado: "happy",
      libre: "adventurous",
    };
    const momentToScene: Record<string, string> = {
      vacaciones: "beach",
      fiesta: "party",
      tranquilo: "indoor",
      concierto: "concert",
      noche: "city",
      inspiracion: "cafe",
      evento: "party",
    };
    return {
      dominantColors: ["neutral"],
      lighting: "natural",
      scene: momentToScene[payload.selectedMomentType] ?? "indoor",
      mood: moodFromSelected[payload.selectedMood] ?? "peaceful",
      activity: "reflecting",
      season: "undefined",
      timeOfDay: "afternoon",
      people: "none",
      energy: payload.selectedMood === "motivado" || payload.selectedMood === "rapero" ? 8 : 5,
      source: "local_fallback",
    };
  };

  if (typeof document === "undefined" || typeof Image === "undefined") {
    const analysis = fallback();
    return {
      success: true,
      photoAnalysis: analysis,
      musicProfile: buildLocalMusicProfile(analysis, payload.selectedMood, payload.selectedMomentType, payload.newMusicPercentage),
      warning: "local_fallback",
    };
  }

  const analysis = await new Promise<Record<string, unknown>>((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const width = 64;
        const height = Math.max(1, Math.round((img.height / img.width) * width));
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return resolve(fallback());
        ctx.drawImage(img, 0, 0, width, height);
        const { data } = ctx.getImageData(0, 0, width, height);

        let r = 0;
        let g = 0;
        let b = 0;
        let brightPixels = 0;
        let darkPixels = 0;
        let warmPixels = 0;
        let coolPixels = 0;
        let saturated = 0;
        const count = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          const rr = data[i];
          const gg = data[i + 1];
          const bb = data[i + 2];
          r += rr;
          g += gg;
          b += bb;
          const brightness = (rr + gg + bb) / 3;
          const max = Math.max(rr, gg, bb);
          const min = Math.min(rr, gg, bb);
          if (brightness > 180) brightPixels++;
          if (brightness < 70) darkPixels++;
          if (rr > bb + 18 && rr > gg - 10) warmPixels++;
          if (bb > rr + 18) coolPixels++;
          if (max - min > 65) saturated++;
        }

        r /= count;
        g /= count;
        b /= count;
        const avgBrightness = (r + g + b) / 3;
        const warmth = warmPixels - coolPixels;
        const dominantColors = [
          saturated / count > 0.45 ? "vibrant" : avgBrightness < 85 ? "muted" : "neutral",
          warmth > count * 0.12 ? "warm" : warmth < -count * 0.12 ? "cool" : "neutral",
        ].filter((v, i, arr) => arr.indexOf(v) === i);

        const lighting = darkPixels / count > 0.42
          ? "night"
          : brightPixels / count > 0.5
            ? "bright"
            : warmth > count * 0.18 && avgBrightness > 105
              ? "golden"
              : "natural";
        const energy = clampEnergy(2 + (avgBrightness / 255) * 4 + (saturated / count) * 4);
        const scene = payload.selectedMomentType === "vacaciones"
          ? "beach"
          : payload.selectedMomentType === "fiesta"
            ? "party"
            : payload.selectedMomentType === "concierto"
              ? "concert"
              : lighting === "night"
                ? "city"
                : "indoor";
        const mood = energy >= 8
          ? "energetic"
          : lighting === "night" || dominantColors.includes("cool")
            ? "nostalgic"
            : dominantColors.includes("warm")
              ? "happy"
              : "peaceful";

        resolve({
          dominantColors,
          lighting,
          scene,
          mood,
          activity: energy >= 7 ? "celebrating" : "reflecting",
          season: dominantColors.includes("warm") ? "summer" : "undefined",
          timeOfDay: lighting === "night" ? "night" : lighting === "golden" ? "evening" : "afternoon",
          people: "none",
          energy,
          source: "local_image_analysis",
        });
      } catch (err) {
        console.warn("Local image analysis failed:", err);
        resolve(fallback());
      }
    };
    img.onerror = () => resolve(fallback());
    img.src = payload.photoBase64;
  });

  return {
    success: true,
    photoAnalysis: analysis,
    musicProfile: buildLocalMusicProfile(analysis, payload.selectedMood, payload.selectedMomentType, payload.newMusicPercentage),
    warning: "local_fallback",
  };
}

export function isPhotoAnalysisConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

async function singleAttempt(
  payload: PhotoAnalysisPayload
): Promise<{ data: PhotoAnalysisData | null; error: PhotoAnalysisErrorCode | null; status: number }> {
  if (!ENDPOINT || !SUPABASE_KEY) {
    return { data: null, error: "missing_config", status: 0 };
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { data: null, error: "offline", status: 0 };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const resp = await fetch(ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (resp.status === 429) {
      return { data: null, error: "rate_limited", status: 429 };
    }
    if (resp.status === 402) {
      return { data: null, error: "payment_required", status: 402 };
    }
    if (resp.status >= 500) {
      return { data: null, error: "server_error", status: resp.status };
    }
    if (resp.status >= 400) {
      return { data: null, error: "bad_request", status: resp.status };
    }

    const json = (await resp.json()) as PhotoAnalysisData;
    if (json?.success && !json.photoAnalysis && payload.photoBase64) {
      return { data: await analyzePhotoLocally(payload), error: null, status: resp.status };
    }
    return { data: json, error: null, status: resp.status };
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { data: null, error: "timeout", status: 0 };
    }
    return { data: null, error: "offline", status: 0 };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Calls analyze-photo once with a short timeout, then falls back locally.
 * Memory Playlist must never make the user wait on a paused Supabase project or missing
 * Lovable AI Gateway key just to generate a playlist.
 */
export async function analyzePhotoWithRetry(
  payload: PhotoAnalysisPayload
): Promise<PhotoAnalysisResult> {
  if (!isPhotoAnalysisConfigured()) {
    return { data: await analyzePhotoLocally(payload), error: null, attempts: 0 };
  }

  let lastError: PhotoAnalysisErrorCode = "unknown";
  let attempts = 0;

  for (let i = 0; i < BACKOFFS.length; i++) {
    attempts++;
    const { data, error } = await singleAttempt(payload);

    if (data && !error) {
      return { data, error: null, attempts };
    }

    lastError = error ?? "unknown";

    // Stop retrying on terminal errors.
    if (
      lastError === "missing_config" ||
      lastError === "bad_request" ||
      lastError === "payment_required" ||
      lastError === "rate_limited"
    ) {
      break;
    }

    if (i < BACKOFFS.length - 1) {
      await sleep(BACKOFFS[i]);
    }
  }

  if (payload.photoBase64) {
    console.warn("Using local photo analysis fallback after backend failure:", lastError);
    return { data: await analyzePhotoLocally(payload), error: null, attempts };
  }

  return { data: null, error: lastError, attempts };
}

export function describePhotoAnalysisError(code: PhotoAnalysisErrorCode): string {
  switch (code) {
    case "missing_config":
      return "Usaremos análisis local mientras el backend de IA se publica.";
    case "offline":
      return "Sin conexión. Verifica tu internet y vuelve a intentar.";
    case "timeout":
      return "El análisis tardó demasiado. Toca para reintentar.";
    case "rate_limited":
      return "Demasiados análisis seguidos. Espera 30 segundos y reintenta.";
    case "payment_required":
      return "Se acabaron los créditos de IA. Avisa al administrador del proyecto.";
    case "server_error":
      return "Nuestro analizador está saturado. Reintenta en unos segundos.";
    case "bad_request":
      return "La imagen no se pudo procesar. Prueba con otra foto.";
    default:
      return "No pudimos analizar tu foto. Toca para reintentar.";
  }
}
