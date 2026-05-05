CREATE POLICY "Usuarios pueden eliminar canciones de sus playlists"
ON public.playlist_tracks
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.playlists
  WHERE playlists.id = playlist_tracks.playlist_id
    AND playlists.user_id = auth.uid()
));