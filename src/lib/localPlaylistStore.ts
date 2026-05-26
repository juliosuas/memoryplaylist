export interface StoredPlaylist {
  id: string;
  emotion?: string;
  moment_type?: string;
  new_music_percentage?: number;
  photo_preview?: string;
  memory_text?: string;
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
    __memoryPlaylistLatestPlaylist?: StoredPlaylistBundle;
  }
}

const STORAGE_KEYS = {
  experiences: "memoryplaylist_experiences",
  playlists: "memoryplaylist_playlists",
  tracks: "memoryplaylist_tracks",
  preferences: "memoryplaylist_preferences",
};

function readArray<T = unknown>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    console.warn(`Memory Playlist could not read ${key}; ignoring corrupted local data.`, error);
    return [];
  }
}

function writeArray<T>(key: string, items: T[], trimTo: number): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch (firstError) {
    console.warn(`Memory Playlist could not write ${key}; trying trimmed fallback.`, firstError);
    try {
      localStorage.setItem(key, JSON.stringify(items.slice(-trimTo)));
      return true;
    } catch (secondError) {
      console.warn(`Memory Playlist storage unavailable for ${key}; continuing in memory.`, secondError);
      return false;
    }
  }
}

export function saveGeneratedPlaylist(bundle: StoredPlaylistBundle): boolean {
  if (typeof window !== "undefined") {
    window.__memoryPlaylistLatestPlaylist = bundle;
  }

  const experiencesOk = bundle.experience
    ? writeArray(STORAGE_KEYS.experiences, [...readArray<Record<string, unknown>>(STORAGE_KEYS.experiences), bundle.experience], 20)
    : true;

  const playlistsOk = writeArray(STORAGE_KEYS.playlists, [...readArray<StoredPlaylist>(STORAGE_KEYS.playlists), bundle.playlist], 50);
  const tracksOk = writeArray(STORAGE_KEYS.tracks, [...readArray<StoredTrack>(STORAGE_KEYS.tracks), ...bundle.tracks], 2000);

  return experiencesOk && playlistsOk && tracksOk;
}

export function loadGeneratedPlaylist(playlistId: string): StoredPlaylistBundle | null {
  const memoryBundle = typeof window !== "undefined" ? window.__memoryPlaylistLatestPlaylist : undefined;
  if (memoryBundle?.playlist.id === playlistId) {
    return memoryBundle;
  }

  const playlist = readArray<StoredPlaylist>(STORAGE_KEYS.playlists).find((p) => p.id === playlistId);
  const tracks = readArray<StoredTrack>(STORAGE_KEYS.tracks).filter((t) => t.playlist_id === playlistId);

  if (!playlist) return null;
  return { playlist, tracks };
}

export function listGeneratedPlaylists(limit = 5): StoredPlaylist[] {
  return readArray<StoredPlaylist>(STORAGE_KEYS.playlists)
    .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")))
    .slice(0, limit);
}

export function createSharePayload(bundle: StoredPlaylistBundle): string {
  const compact = {
    playlist: {
      id: bundle.playlist.id,
      name: bundle.playlist.name,
      emotion: bundle.playlist.emotion,
      moment_type: bundle.playlist.moment_type,
      new_music_percentage: bundle.playlist.new_music_percentage,
      memory_text: bundle.playlist.memory_text,
      photo_analysis: bundle.playlist.photo_analysis,
      photo_preview: bundle.playlist.photo_preview,
    },
    tracks: bundle.tracks.map((track) => ({
      id: track.id,
      playlist_id: track.playlist_id,
      track_name: track.track_name,
      artist: track.artist,
      album: track.album,
      is_new_discovery: track.is_new_discovery,
      youtubeId: track.youtubeId,
    })),
  };

  return btoa(encodeURIComponent(JSON.stringify(compact)));
}

export function importSharedPlaylistFromUrl(hash: string): StoredPlaylistBundle | null {
  const match = hash.match(/(?:^#|&)share=([^&]+)/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(atob(match[1]))) as StoredPlaylistBundle;
    if (!parsed.playlist?.id || !Array.isArray(parsed.tracks)) return null;
    const bundle = {
      playlist: { ...parsed.playlist, id: String(parsed.playlist.id) },
      tracks: parsed.tracks.map((track, index) => ({
        ...track,
        id: String(track.id ?? `${parsed.playlist.id}-${index}`),
        playlist_id: String(track.playlist_id ?? parsed.playlist.id),
        track_name: String(track.track_name ?? "Canción"),
        artist: String(track.artist ?? "Artista"),
        album: track.album ?? null,
        is_new_discovery: Boolean(track.is_new_discovery),
      })),
    };
    saveGeneratedPlaylist(bundle);
    return bundle;
  } catch (error) {
    console.warn("Memory Playlist could not import shared playlist payload.", error);
    return null;
  }
}

export function saveLikedTrack(track: { track_name: string; artist: string }): boolean {
  const prefs = readArray<Record<string, unknown>>(STORAGE_KEYS.preferences);
  prefs.push({
    id: Date.now().toString(),
    track_name: track.track_name,
    artist: track.artist,
    liked: true,
    created_at: new Date().toISOString(),
  });
  return writeArray(STORAGE_KEYS.preferences, prefs, 500);
}
