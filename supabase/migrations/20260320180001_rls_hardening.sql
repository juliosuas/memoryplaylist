-- ============================================================
-- Migration: RLS Policy Hardening
-- Ensures all tables have complete CRUD RLS policies.
-- Existing policies are preserved (IF NOT EXISTS pattern via DO blocks).
-- ============================================================

-- playlist_tracks: add DELETE policy (was missing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'playlist_tracks' AND policyname = 'Usuarios pueden eliminar canciones de sus playlists'
  ) THEN
    CREATE POLICY "Usuarios pueden eliminar canciones de sus playlists"
      ON public.playlist_tracks FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM public.playlists
          WHERE playlists.id = playlist_tracks.playlist_id
          AND playlists.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- playlist_tracks: add UPDATE policy (was missing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'playlist_tracks' AND policyname = 'Usuarios pueden actualizar canciones de sus playlists'
  ) THEN
    CREATE POLICY "Usuarios pueden actualizar canciones de sus playlists"
      ON public.playlist_tracks FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.playlists
          WHERE playlists.id = playlist_tracks.playlist_id
          AND playlists.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- playlists: add UPDATE policy (was missing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'playlists' AND policyname = 'Usuarios pueden actualizar sus propias playlists'
  ) THEN
    CREATE POLICY "Usuarios pueden actualizar sus propias playlists"
      ON public.playlists FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- music_preferences: add DELETE policy (was missing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'music_preferences' AND policyname = 'Usuarios pueden eliminar sus propias preferencias'
  ) THEN
    CREATE POLICY "Usuarios pueden eliminar sus propias preferencias"
      ON public.music_preferences FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- user_profiles: add DELETE policy (was missing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_profiles' AND policyname = 'Usuarios pueden eliminar su propio perfil'
  ) THEN
    CREATE POLICY "Usuarios pueden eliminar su propio perfil"
      ON public.user_profiles FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;
