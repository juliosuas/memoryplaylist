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
  photoAnalysis: Record<string, any> | null;
  musicProfile: Record<string, any> | null;
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

const REQUEST_TIMEOUT_MS = 25_000;
const BACKOFFS = [500, 1500, 3000];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
    return { data: json, error: null, status: resp.status };
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return { data: null, error: "timeout", status: 0 };
    }
    return { data: null, error: "offline", status: 0 };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Calls analyze-photo with up to 3 retries on transient errors
 * (offline, timeout, server_error). Returns the first success or
 * the last error encountered.
 */
export async function analyzePhotoWithRetry(
  payload: PhotoAnalysisPayload
): Promise<PhotoAnalysisResult> {
  if (!isPhotoAnalysisConfigured()) {
    return { data: null, error: "missing_config", attempts: 0 };
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

  return { data: null, error: lastError, attempts };
}

export function describePhotoAnalysisError(code: PhotoAnalysisErrorCode): string {
  switch (code) {
    case "missing_config":
      return "El backend de IA no está configurado. Recarga la página o vuelve a publicar.";
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
