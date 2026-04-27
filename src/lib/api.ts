/**
 * API Helper Layer for Fryda
 * Typed functions for all Supabase database operations.
 * Components should use these instead of raw supabase calls.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { handleError, classifyError } from "./error-handler";

// ── Type Aliases ─────────────────────────────────────────────
export type Experience = Tables<"experiences">;
export type ExperienceInsert = TablesInsert<"experiences">;
export type Playlist = Tables<"playlists">;
export type PlaylistInsert = TablesInsert<"playlists">;
export type PlaylistTrack = Tables<"playlist_tracks">;
export type PlaylistTrackInsert = TablesInsert<"playlist_tracks">;
export type MusicPreference = Tables<"music_preferences">;
export type MusicPreferenceInsert = TablesInsert<"music_preferences">;
export type UserProfile = Tables<"user_profiles">;
export type UserProfileInsert = TablesInsert<"user_profiles">;

// ── Result type ──────────────────────────────────────────────
interface ApiResult<T> {
  data: T | null;
  error: string | null; // error code from error-handler
}

// ── Helpers ──────────────────────────────────────────────────
async function wrap<T>(
  fn: () => PromiseLike<{ data: T | null; error: unknown }>,
  fallbackCode?: string
): Promise<ApiResult<T>> {
  try {
    const { data, error } = await fn();
    if (error) {
      const code = handleError(error, fallbackCode);
      return { data: null, error: code };
    }
    return { data, error: null };
  } catch (err) {
    const code = handleError(err, fallbackCode);
    return { data: null, error: code };
  }
}

// ── Auth ─────────────────────────────────────────────────────

/** Get the current authenticated user ID, or null */
export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/** Get the current session */
export async function getSession() {
  return supabase.auth.getSession();
}

// ── User Profiles ────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<ApiResult<UserProfile>> {
  return wrap(
    () =>
      supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
    "DB_FETCH_FAILED"
  );
}

export async function upsertUserProfile(
  profile: UserProfileInsert
): Promise<ApiResult<UserProfile>> {
  return wrap(
    () =>
      supabase
        .from("user_profiles")
        .upsert(profile, { onConflict: "user_id" })
        .select()
        .single(),
    "DB_INSERT_FAILED"
  );
}

// ── Experiences ──────────────────────────────────────────────

export async function createExperience(
  experience: ExperienceInsert
): Promise<ApiResult<Experience>> {
  return wrap(
    () =>
      supabase
        .from("experiences")
        .insert(experience)
        .select()
        .single(),
    "DB_INSERT_FAILED"
  );
}

export async function getExperiences(
  userId: string,
  limit = 50,
  offset = 0
): Promise<ApiResult<Experience[]>> {
  return wrap(
    () =>
      supabase
        .from("experiences")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1),
    "DB_FETCH_FAILED"
  );
}

export async function deleteExperience(id: string): Promise<ApiResult<null>> {
  return wrap(
    () => supabase.from("experiences").delete().eq("id", id),
    "DB_DELETE_FAILED"
  ) as Promise<ApiResult<null>>;
}

// ── Playlists ────────────────────────────────────────────────

export async function createPlaylist(
  playlist: PlaylistInsert
): Promise<ApiResult<Playlist>> {
  return wrap(
    () =>
      supabase
        .from("playlists")
        .insert(playlist)
        .select()
        .single(),
    "DB_INSERT_FAILED"
  );
}

export async function getPlaylists(
  userId: string,
  limit = 50,
  offset = 0
): Promise<ApiResult<Playlist[]>> {
  return wrap(
    () =>
      supabase
        .from("playlists")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1),
    "DB_FETCH_FAILED"
  );
}

export async function getPlaylistById(id: string): Promise<ApiResult<Playlist>> {
  return wrap(
    () =>
      supabase
        .from("playlists")
        .select("*")
        .eq("id", id)
        .single(),
    "DB_FETCH_FAILED"
  );
}

export async function getPlaylistWithTracks(id: string): Promise<
  ApiResult<Playlist & { tracks: PlaylistTrack[] }>
> {
  try {
    const { data: playlist, error: pError } = await supabase
      .from("playlists")
      .select("*")
      .eq("id", id)
      .single();

    if (pError) {
      handleError(pError, "DB_FETCH_FAILED");
      return { data: null, error: "DB_FETCH_FAILED" };
    }

    const { data: tracks, error: tError } = await supabase
      .from("playlist_tracks")
      .select("*")
      .eq("playlist_id", id)
      .order("created_at", { ascending: true });

    if (tError) {
      handleError(tError, "DB_FETCH_FAILED");
      return { data: null, error: "DB_FETCH_FAILED" };
    }

    return {
      data: { ...playlist, tracks: tracks || [] },
      error: null,
    };
  } catch (err) {
    handleError(err, "DB_FETCH_FAILED");
    return { data: null, error: "DB_FETCH_FAILED" };
  }
}

export async function deletePlaylist(id: string): Promise<ApiResult<null>> {
  return wrap(
    () => supabase.from("playlists").delete().eq("id", id),
    "DB_DELETE_FAILED"
  ) as Promise<ApiResult<null>>;
}

// ── Playlist Tracks ──────────────────────────────────────────

export async function addPlaylistTracks(
  tracks: PlaylistTrackInsert[]
): Promise<ApiResult<PlaylistTrack[]>> {
  return wrap(
    () =>
      supabase
        .from("playlist_tracks")
        .insert(tracks)
        .select(),
    "DB_INSERT_FAILED"
  );
}

export async function getPlaylistTracks(
  playlistId: string
): Promise<ApiResult<PlaylistTrack[]>> {
  return wrap(
    () =>
      supabase
        .from("playlist_tracks")
        .select("*")
        .eq("playlist_id", playlistId)
        .order("created_at", { ascending: true }),
    "DB_FETCH_FAILED"
  );
}

// ── Music Preferences ────────────────────────────────────────

export async function likeTrack(
  userId: string,
  trackName: string,
  artist: string
): Promise<ApiResult<MusicPreference>> {
  return wrap(
    () =>
      supabase
        .from("music_preferences")
        .upsert(
          { user_id: userId, track_name: trackName, artist, liked: true },
          { onConflict: "user_id,track_name,artist" }
        )
        .select()
        .single(),
    "DB_INSERT_FAILED"
  );
}

export async function unlikeTrack(
  userId: string,
  trackName: string,
  artist: string
): Promise<ApiResult<MusicPreference>> {
  return wrap(
    () =>
      supabase
        .from("music_preferences")
        .upsert(
          { user_id: userId, track_name: trackName, artist, liked: false },
          { onConflict: "user_id,track_name,artist" }
        )
        .select()
        .single(),
    "DB_INSERT_FAILED"
  );
}

export async function getLikedTracks(
  userId: string
): Promise<ApiResult<MusicPreference[]>> {
  return wrap(
    () =>
      supabase
        .from("music_preferences")
        .select("*")
        .eq("user_id", userId)
        .eq("liked", true)
        .order("created_at", { ascending: false }),
    "DB_FETCH_FAILED"
  );
}

// ── Edge Function Invocations ────────────────────────────────

export interface PhotoAnalysisRequest {
  photoBase64: string;
  selectedMood: string;
  selectedMomentType: string;
  selectedTags: Array<{ type: string; value: string; label: string }>;
  newMusicPercentage: number;
}

export interface PhotoAnalysisResponse {
  success: boolean;
  photoAnalysis: Record<string, unknown> | null;
  musicProfile: Record<string, unknown> | null;
}

export async function analyzePhoto(
  params: PhotoAnalysisRequest
): Promise<ApiResult<PhotoAnalysisResponse>> {
  try {
    const { data, error } = await supabase.functions.invoke("analyze-photo", {
      body: params,
    });

    if (error) {
      handleError(error, "AI_ANALYSIS_FAILED");
      return { data: null, error: "AI_ANALYSIS_FAILED" };
    }

    return { data, error: null };
  } catch (err) {
    handleError(err, "AI_ANALYSIS_FAILED");
    return { data: null, error: "AI_ANALYSIS_FAILED" };
  }
}

export interface EmotionAnalysisRequest {
  description: string;
  photoUrl?: string;
  discoveryPercentage: number;
  userId: string;
}

export interface EmotionAnalysisResponse {
  playlistId: string;
  emotion: string;
  tracksCount: number;
}

export async function analyzeEmotion(
  params: EmotionAnalysisRequest
): Promise<ApiResult<EmotionAnalysisResponse>> {
  try {
    const { data, error } = await supabase.functions.invoke("analyze-emotion", {
      body: params,
    });

    if (error) {
      handleError(error, "AI_EMOTION_FAILED");
      return { data: null, error: "AI_EMOTION_FAILED" };
    }

    return { data, error: null };
  } catch (err) {
    handleError(err, "AI_EMOTION_FAILED");
    return { data: null, error: "AI_EMOTION_FAILED" };
  }
}

// ── Storage ──────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE_MB = 10;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "VALIDATION_INVALID_FILE_TYPE";
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return "VALIDATION_FILE_TOO_LARGE";
  }
  return null;
}

export async function uploadExperiencePhoto(
  userId: string,
  file: File
): Promise<ApiResult<string>> {
  const validationError = validateImageFile(file);
  if (validationError) {
    handleError(null, validationError);
    return { data: null, error: validationError };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("experience-photos")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      handleError(uploadError, "DB_INSERT_FAILED");
      return { data: null, error: "DB_INSERT_FAILED" };
    }

    // Bucket is private; return a short-lived signed URL (1 hour).
    const { data: signed, error: signedError } = await supabase.storage
      .from("experience-photos")
      .createSignedUrl(path, 3600);

    if (signedError || !signed?.signedUrl) {
      handleError(signedError, "DB_FETCH_FAILED");
      return { data: null, error: "DB_FETCH_FAILED" };
    }

    return { data: signed.signedUrl, error: null };
  } catch (err) {
    handleError(err, "DB_INSERT_FAILED");
    return { data: null, error: "DB_INSERT_FAILED" };
  }
}
