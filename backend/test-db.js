import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkDatabase() {
  console.log("Checking Supabase connection...");
  
  const { data: projects, error: pError } = await supabase.from('projects').select('*');
  if (pError) console.error("Projects Error:", pError.message);
  else console.log("Projects count:", projects.length);

  const { data: reports, error: rError } = await supabase.from('reports').select('*');
  if (rError) console.error("Reports Error:", rError.message);
  else console.log("Reports count:", reports.length);
}

checkDatabase();
