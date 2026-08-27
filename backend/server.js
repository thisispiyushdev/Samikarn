import app from './src/app.js';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { supabase } from './src/config/supabase.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Run automatically every 5 days at midnight
cron.schedule('0 0 */5 * *', async () => {
  console.log('Running 5-day automated test data cron job...');
  try {
    const { error } = await supabase.from('contacts').insert([{
      name: 'Automated Cron User',
      email: 'cron@system.local',
      subject: 'Cron Job 5-day Test',
      message: 'This data was inserted automatically by node-cron every 5 days.',
    }]);
    if (error) {
      console.error('Cron Supabase Error:', error);
    } else {
      console.log('Successfully inserted test contact data via cron.');
    }
  } catch (error) {
    console.error('Cron execution error:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
