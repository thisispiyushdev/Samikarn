import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testGallery() {
  console.log('Querying moments_gallery...');
  const { data, error } = await supabase.from('moments_gallery').select('*').order('created_at', { ascending: false }).limit(20);
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Data:', data.map(d => ({ id: d.id, title: d.title, imageLength: d.image ? d.image.length : 0 })));
  }
}

testGallery();
