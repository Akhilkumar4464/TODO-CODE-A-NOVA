import cron from 'node-cron';

// This file is wired early, but will only become fully functional once Task model exists.
export default function reminderCron() {
  // Run every day at 9:00 AM server time
  cron.schedule('0 9 * * *', async () => {
    // Intentionally minimal for now; the full implementation will be added with Task model.
    console.log('[CRON] reminderCron tick (tasks reminder not implemented yet).');
  });

  console.log('[CRON] reminderCron scheduled.');
}

