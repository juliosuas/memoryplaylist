/**
 * Centralized Error Handler for VibePlaylist
 * Bilingual error messages (ES/EN) with toast integration.
 */
import { toast } from "sonner";

type Language = "es" | "en";

// Detect language from browser — default to Spanish
function detectLanguage(): Language {
  const lang = navigator.language?.toLowerCase() || "es";
  return lang.startsWith("en") ? "en" : "es";
}

const lang = detectLanguage();

// ── Error Code Registry ──────────────────────────────────────
interface ErrorEntry {
  es: string;
  en: string;
}

const ERROR_MESSAGES: Record<string, ErrorEntry> = {
  // Auth
  AUTH_REQUIRED: {
    es: "Debes iniciar sesión para continuar",
    en: "You must sign in to continue",
  },
  AUTH_EXPIRED: {
    es: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo",
    en: "Your session has expired. Please sign in again",
  },

  // Rate limiting
  RATE_LIMITED: {
    es: "Demasiadas solicitudes. Espera un momento antes de intentar de nuevo",
    en: "Too many requests. Please wait a moment before trying again",
  },
  RATE_LIMITED_PHOTO: {
    es: "Has analizado demasiadas fotos. Espera un minuto",
    en: "You've analyzed too many photos. Wait a minute",
  },
  RATE_LIMITED_EMOTION: {
    es: "Demasiados análisis de emoción. Espera un momento",
    en: "Too many emotion analyses. Wait a moment",
  },

  // Validation
  VALIDATION_MOOD_REQUIRED: {
    es: "Selecciona cómo te sentías en ese momento",
    en: "Select how you were feeling at that moment",
  },
  VALIDATION_DESCRIPTION_TOO_LONG: {
    es: "La descripción es demasiado larga (máximo 2000 caracteres)",
    en: "Description is too long (max 2000 characters)",
  },
  VALIDATION_INVALID_FILE_TYPE: {
    es: "Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, WebP, GIF)",
    en: "Invalid file type. Only images are allowed (JPEG, PNG, WebP, GIF)",
  },
  VALIDATION_FILE_TOO_LARGE: {
    es: "La imagen es demasiado grande. El tamaño máximo es 10 MB",
    en: "Image is too large. Maximum size is 10 MB",
  },

  // AI / Edge Functions
  AI_ANALYSIS_FAILED: {
    es: "No se pudo analizar la foto. Puedes continuar sin ella",
    en: "Could not analyze the photo. You can continue without it",
  },
  AI_EMOTION_FAILED: {
    es: "Error al detectar la emoción. Intenta de nuevo",
    en: "Error detecting emotion. Please try again",
  },
  AI_KEY_MISSING: {
    es: "Configuración de IA no disponible",
    en: "AI configuration not available",
  },

  // Database
  DB_INSERT_FAILED: {
    es: "Error al guardar los datos. Intenta de nuevo",
    en: "Error saving data. Please try again",
  },
  DB_FETCH_FAILED: {
    es: "Error al cargar los datos",
    en: "Error loading data",
  },
  DB_DELETE_FAILED: {
    es: "Error al eliminar. Intenta de nuevo",
    en: "Error deleting. Please try again",
  },

  // Playlist
  PLAYLIST_GENERATION_FAILED: {
    es: "Error al generar la playlist. Intenta de nuevo",
    en: "Error generating playlist. Please try again",
  },
  PLAYLIST_NOT_FOUND: {
    es: "Playlist no encontrada",
    en: "Playlist not found",
  },

  // Network
  NETWORK_ERROR: {
    es: "Error de conexión. Verifica tu internet",
    en: "Connection error. Check your internet",
  },
  SERVER_ERROR: {
    es: "Error del servidor. Intenta más tarde",
    en: "Server error. Try again later",
  },

  // Generic
  UNKNOWN: {
    es: "Ocurrió un error inesperado",
    en: "An unexpected error occurred",
  },
};

// ── Public API ───────────────────────────────────────────────

/** Get a localized error message by code */
export function getErrorMessage(code: string): string {
  const entry = ERROR_MESSAGES[code];
  if (!entry) return ERROR_MESSAGES.UNKNOWN[lang];
  return entry[lang];
}

/** Show an error toast with the localized message */
export function showError(code: string, details?: string): void {
  const message = getErrorMessage(code);
  toast.error(details ? `${message}: ${details}` : message);
}

/** Show a success toast (bilingual convenience) */
export function showSuccess(esMessage: string, enMessage: string): void {
  toast.success(lang === "en" ? enMessage : esMessage);
}

/** Show an info toast (bilingual convenience) */
export function showInfo(esMessage: string, enMessage: string): void {
  toast.info(lang === "en" ? enMessage : esMessage);
}

/**
 * Classify a raw error into an error code.
 * Handles Supabase errors, fetch errors, and generic JS errors.
 */
export function classifyError(error: unknown): string {
  if (!error) return "UNKNOWN";

  // Supabase PostgREST errors
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    // Supabase error shape: { code, message, details }
    if (err.code === "PGRST301" || err.code === "42501") return "AUTH_REQUIRED";
    if (err.code === "23505") return "DB_INSERT_FAILED"; // unique violation
    if (err.code === "23503") return "DB_INSERT_FAILED"; // FK violation
    if (err.code === "429" || err.status === 429) return "RATE_LIMITED";

    // Network errors
    if (err.name === "TypeError" && typeof err.message === "string") {
      if (err.message.includes("fetch") || err.message.includes("network") || err.message.includes("Failed to fetch")) {
        return "NETWORK_ERROR";
      }
    }

    // Generic message-based classification
    if (typeof err.message === "string") {
      const msg = err.message.toLowerCase();
      if (msg.includes("jwt") || msg.includes("token") || msg.includes("auth")) return "AUTH_EXPIRED";
      if (msg.includes("rate limit") || msg.includes("too many")) return "RATE_LIMITED";
      if (msg.includes("not found")) return "PLAYLIST_NOT_FOUND";
    }
  }

  return "UNKNOWN";
}

/**
 * Handle an error: classify it and show a toast.
 * Returns the error code for further handling.
 */
export function handleError(error: unknown, fallbackCode?: string): string {
  const code = fallbackCode || classifyError(error);
  console.error(`[VibePlaylist Error] ${code}:`, error);
  showError(code);
  return code;
}
