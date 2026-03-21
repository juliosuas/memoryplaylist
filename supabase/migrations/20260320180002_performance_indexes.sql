-- ============================================================
-- Migration: Performance Indexes
-- Add indexes on foreign keys, timestamps, and frequently queried columns.
-- ============================================================

-- experiences
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences (user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_created_at ON public.experiences (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiences_user_created ON public.experiences (user_id, created_at DESC);

-- playlists
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON public.playlists (user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_experience_id ON public.playlists (experience_id);
CREATE INDEX IF NOT EXISTS idx_playlists_created_at ON public.playlists (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_playlists_user_created ON public.playlists (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_playlists_emotion ON public.playlists (emotion);

-- playlist_tracks
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON public.playlist_tracks (playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_created_at ON public.playlist_tracks (created_at DESC);

-- music_preferences
CREATE INDEX IF NOT EXISTS idx_music_preferences_user_id ON public.music_preferences (user_id);
CREATE INDEX IF NOT EXISTS idx_music_preferences_user_liked ON public.music_preferences (user_id, liked);
CREATE INDEX IF NOT EXISTS idx_music_preferences_created_at ON public.music_preferences (created_at DESC);

-- user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles (user_id);
