
CREATE POLICY "Usuarios pueden eliminar su propio perfil"
ON public.user_profiles FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias playlists"
ON public.playlists FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar canciones de sus playlists"
ON public.playlist_tracks FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.playlists WHERE playlists.id = playlist_tracks.playlist_id AND playlists.user_id = auth.uid()));

CREATE POLICY "Usuarios pueden eliminar sus propias preferencias"
ON public.music_preferences FOR DELETE
USING (auth.uid() = user_id);
