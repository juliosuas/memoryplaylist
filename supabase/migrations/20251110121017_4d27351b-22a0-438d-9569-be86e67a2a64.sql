-- Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_profiles
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear su propio perfil"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Crear tabla de experiencias (fotos + descripciones)
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  emotion_detected TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para experiences
CREATE POLICY "Usuarios pueden ver sus propias experiencias"
  ON public.experiences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propias experiencias"
  ON public.experiences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias experiencias"
  ON public.experiences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias experiencias"
  ON public.experiences FOR DELETE
  USING (auth.uid() = user_id);

-- Crear tabla de playlists generadas
CREATE TABLE IF NOT EXISTS public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emotion TEXT,
  discovery_percentage INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para playlists
CREATE POLICY "Usuarios pueden ver sus propias playlists"
  ON public.playlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propias playlists"
  ON public.playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias playlists"
  ON public.playlists FOR DELETE
  USING (auth.uid() = user_id);

-- Crear tabla de canciones en playlists
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_name TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  is_new_discovery BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para playlist_tracks
CREATE POLICY "Usuarios pueden ver canciones de sus playlists"
  ON public.playlist_tracks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_tracks.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden agregar canciones a sus playlists"
  ON public.playlist_tracks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_tracks.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

-- Crear tabla de preferencias musicales del usuario
CREATE TABLE IF NOT EXISTS public.music_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  track_name TEXT NOT NULL,
  artist TEXT NOT NULL,
  liked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_name, artist)
);

-- Habilitar RLS
ALTER TABLE public.music_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para music_preferences
CREATE POLICY "Usuarios pueden ver sus propias preferencias"
  ON public.music_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propias preferencias"
  ON public.music_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias preferencias"
  ON public.music_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();