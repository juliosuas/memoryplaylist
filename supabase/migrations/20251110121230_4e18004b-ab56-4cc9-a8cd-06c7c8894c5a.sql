-- Crear bucket de almacenamiento para fotos de experiencias
INSERT INTO storage.buckets (id, name, public) 
VALUES ('experience-photos', 'experience-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para ver fotos (públicas)
CREATE POLICY "Las fotos son accesibles públicamente"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'experience-photos');

-- Política para subir fotos (solo usuarios autenticados)
CREATE POLICY "Usuarios pueden subir sus propias fotos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'experience-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para actualizar fotos
CREATE POLICY "Usuarios pueden actualizar sus propias fotos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'experience-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para eliminar fotos
CREATE POLICY "Usuarios pueden eliminar sus propias fotos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'experience-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );