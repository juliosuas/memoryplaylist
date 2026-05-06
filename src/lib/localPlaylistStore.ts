export interface StoredPlaylist {
  id: string;
  emotion?: string;
  moment_type?: string;
  new_music_percentage?: number;
  photo_analysis?: {
    scene?: string;
    mood?: string;
  } | null;
  [key: string]: unknown;
}

export interface StoredTrack {
  id: string;
  playlist_id: string;
  track_name: string;
  artist: string;
  album: string | null;
  album_cover?: string;
  is_new_discovery: boolean;
  youtubeId?: string;
  [key: string]: unknown;
}

export interface StoredPlaylistBundle {
  playlist: StoredPlaylist;
  tracks: StoredTrack[];
  experience?: Record<string, unknown>;
}

declare global {
  interface Window {
    __frydaLatestPlaylist?: StoredPlaylistBundle;
  }
}

function readArray<T = unknown>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    console.warn(`Fryda could not read ${key}; ignoring corrupted local data.`, error);
    return [];
  }
}

function writeArray<T>(key: string, items: T[], trimTo: number): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch (firstError) {
    console.warn(`Fryda could not write ${key}; trying trimmed fallback.`, firstError);
    try {
      localStorage.setItem(key, JSON.stringify(items.slice(-trimTo)));
      return true;
    } catch (secondError) {
      console.warn(`Fryda storage unavailable for ${key}; continuing in memory.`, secondError);
      return false;
    }
  }
}

export function saveGeneratedPlaylist(bundle: StoredPlaylistBundle): boolean {
  if (typeof window !== "undefined") {
    window.__frydaLatestPlaylist = bundle;
  }

  const experiencesOk = bundle.experience
    ? writeArray("fryda_experiences", [...readArray<Record<string, unknown>>("fryda_experiences"), bundle.experience], 20)
    : true;

  const playlistsOk = writeArray("fryda_playlists", [...readArray<StoredPlaylist>("fryda_playlists"), bundle.playlist], 50);
  const tracksOk = writeArray("fryda_tracks", [...readArray<StoredTrack>("fryda_tracks"), ...bundle.tracks], 2000);

  return experiencesOk && playlistsOk && tracksOk;
}

export function loadGeneratedPlaylist(playlistId: string): StoredPlaylistBundle | null {
  const memoryBundle = typeof window !== "undefined" ? window.__frydaLatestPlaylist : undefined;
  if (memoryBundle?.playlist.id === playlistId) {
    return memoryBundle;
  }

  const playlist = readArray<StoredPlaylist>("fryda_playlists").find((p) => p.id === playlistId);
  const tracks = readArray<StoredTrack>("fryda_tracks").filter((t) => t.playlist_id === playlistId);

  if (!playlist) return null;
  return { playlist, tracks };
}

export function saveLikedTrack(track: { track_name: string; artist: string }): boolean {
  const prefs = readArray<Record<string, unknown>>("fryda_preferences");
  prefs.push({
    id: Date.now().toString(),
    track_name: track.track_name,
    artist: track.artist,
    liked: true,
    created_at: new Date().toISOString(),
  });
  return writeArray("fryda_preferences", prefs, 500);
}
