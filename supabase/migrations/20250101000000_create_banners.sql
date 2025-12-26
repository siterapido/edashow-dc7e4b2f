-- Create banners table
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_path TEXT NOT NULL,
    link_url TEXT NOT NULL,
    location TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only active banners within date range)
CREATE POLICY "Enable read access for active banners" ON public.banners
    FOR SELECT TO public 
    USING (
        is_active = true 
        AND start_date <= timezone('utc'::text, now())
        AND (end_date IS NULL OR end_date >= timezone('utc'::text, now()))
    );

-- Create policy for service role/admin full access
CREATE POLICY "Enable all access for service role" ON public.banners
    FOR ALL TO service_role USING (true);

-- Create storage bucket for banners
BEGIN;
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('banners', 'banners', true)
  ON CONFLICT (id) DO NOTHING;
COMMIT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_banners_location ON public.banners(location);
CREATE INDEX IF NOT EXISTS idx_banners_active ON public.banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_dates ON public.banners(start_date, end_date);
