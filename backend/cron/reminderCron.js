import cron from 'node-cron';
import { Task } from '../models/Task.model.js';
import { User } from '../models/User.model.js';
import { sendReminderEmail } from '../config/mailer.js';

export default function reminderCron() {
  // Run every hour to check for upcoming task deadlines
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Running task due-date reminder check...');
    try {
      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Find tasks due in the next 24 hours that are not Completed and haven't sent reminders
      const dueTasks = await Task.find({
        dueDate: { $gte: now, $lte: next24Hours },
        status: { $ne: 'Completed' },
        reminderSent: false,
      });

      console.log(`[CRON] Found ${dueTasks.length} tasks due within next 24 hours.`);

      for (const task of dueTasks) {
        const user = await User.findById(task.userId);
        if (user) {
          try {
            await sendReminderEmail(user.gmail, user.UserName, task.title, task.dueDate);
            task.reminderSent = true;
            await task.save();
            console.log(`[CRON] Reminder email sent to ${user.gmail} for task "${task.title}"`);
          } catch (err) {
            console.error(`[CRON] Error sending reminder email for task "${task.title}":`, err.message);
          }
        }
      }
    } catch (error) {
      console.error('[CRON] Error in reminder check cron:', error.message);
    }
  });

  console.log('[CRON] reminderCron scheduled.');
}
