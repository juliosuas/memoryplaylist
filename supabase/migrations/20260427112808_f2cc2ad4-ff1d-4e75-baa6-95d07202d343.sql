
-- Make experience-photos bucket private
UPDATE storage.buckets SET public = false WHERE id = 'experience-photos';

-- Drop the open public SELECT policy
DROP POLICY IF EXISTS "Las fotos son accesibles públicamente" ON storage.objects;

-- Create user-scoped SELECT policy (only owners can read their own photos)
CREATE POLICY "Users can view their own experience photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'experience-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
