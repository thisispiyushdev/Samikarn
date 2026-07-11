-- Run this script in your Supabase SQL Editor to add the socials column

ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS socials JSONB DEFAULT '{"instagram": "", "facebook": "", "linkedin": "", "youtube": "", "twitter": "", "whatsapp": ""}';
