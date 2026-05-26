export const FREE_PLAYLIST_LIMIT = 3;

const ACCESS_STORAGE_KEY = "memoryplaylist_access";
const PLAYLISTS_STORAGE_KEY = "memoryplaylist_playlists";

export interface PlaylistAccessState {
  generatedCount: number;
  freeLimit: number;
  remainingFree: number;
  isUnlocked: boolean;
  isLimitReached: boolean;
  checkoutUrl: string;
}

interface StoredAccess {
  unlocked?: boolean;
  unlocked_at?: string;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.warn(`Memory Playlist could not read ${key}; using fallback.`, error);
    return fallback;
  }
}

function getCheckoutUrl(): string {
  return (
    import.meta.env.VITE_STRIPE_PAYMENT_LINK ||
    import.meta.env.VITE_STRIPE_CHECKOUT_URL ||
    ""
  );
}

export function syncPaidAccessFromUrl(): boolean {
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const paid =
    params.get("paid") === "1" ||
    params.get("checkout") === "success" ||
    params.get("stripe") === "success" ||
    hashParams.get("paid") === "1" ||
    hashParams.get("checkout") === "success" ||
    hashParams.get("stripe") === "success";

  if (!paid) return false;

  localStorage.setItem(
    ACCESS_STORAGE_KEY,
    JSON.stringify({ unlocked: true, unlocked_at: new Date().toISOString() })
  );
  return true;
}

export function getPlaylistAccessState(): PlaylistAccessState {
  const playlists = readJson<unknown[]>(PLAYLISTS_STORAGE_KEY, []);
  const access = readJson<StoredAccess>(ACCESS_STORAGE_KEY, {});
  const generatedCount = Array.isArray(playlists) ? playlists.length : 0;
  const isUnlocked = Boolean(access.unlocked);
  const remainingFree = Math.max(FREE_PLAYLIST_LIMIT - generatedCount, 0);

  return {
    generatedCount,
    freeLimit: FREE_PLAYLIST_LIMIT,
    remainingFree,
    isUnlocked,
    isLimitReached: !isUnlocked && generatedCount >= FREE_PLAYLIST_LIMIT,
    checkoutUrl: getCheckoutUrl(),
  };
}
