-- Create sponsors table
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_path TEXT NOT NULL,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON public.sponsors
    FOR SELECT TO public USING (true);

-- Create policy for service role/admin full access
CREATE POLICY "Enable all access for service role" ON public.sponsors
    FOR ALL TO service_role USING (true);

-- Create storage bucket for sponsors if it doesn't exist (this is usually done via API/Dashboard, 
-- but we can try to insert into storage.buckets if we had permissions, 
-- however standard practice in migrations often assumes the bucket creation or handles it separately.
-- For this script, we'll assume the bucket 'sponsors' will be created by the import script or manually if needed, 
-- but we can set up the RLS for objects in it if we assume it exists).

-- Allow public access to sponsors bucket
-- Note: This SQL assumes the storage schema is available and we can insert policies for it.
-- If storage schema is not accessible via this user, this might fail, but let's try standard Supabase storage policies.
BEGIN;
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('sponsors', 'sponsors', true)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO storage.policies (name, definition, bucket_id, read, write, create, update, delete)
  VALUES 
  (
    'Public Access', 
    'bucket_id = ''sponsors''', 
    'sponsors', 
    true, 
    false, 
    false, 
    false, 
    false
  ) ON CONFLICT DO NOTHING;
COMMIT;
