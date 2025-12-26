-- Create a public bucket for media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('edashow-media', 'edashow-media', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for public access (Read)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'edashow-media');

-- Policies for authenticated users (All operations)
CREATE POLICY "Auth Access" ON storage.objects
FOR ALL USING (bucket_id = 'edashow-media' AND auth.role() = 'authenticated');
