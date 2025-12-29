-- Add instagram_url to sponsors table
ALTER TABLE public.sponsors 
ADD COLUMN IF NOT EXISTS instagram_url TEXT;

-- Update comments for clarity
COMMENT ON COLUMN public.sponsors.website IS 'Sponsor website URL';
COMMENT ON COLUMN public.sponsors.instagram_url IS 'Sponsor Instagram profile URL';
