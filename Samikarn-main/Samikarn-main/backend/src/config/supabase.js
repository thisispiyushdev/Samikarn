import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
// Prefer the Service Role Key to bypass RLS for administrative actions in the backend
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'placeholder';

if (!process.env.SUPABASE_URL || !supabaseKey) {
  console.warn('Supabase URL or Key is missing. Check your .env!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
