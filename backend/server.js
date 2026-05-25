import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import { connectDB } from './config/db.js';
import { createTransporter } from './config/mailer.js';
import reminderCron from './cron/reminderCron.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGO_URI);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.use('/api/auth', authRoutes);

// Cron safely runs only if cron and models exist later.
try {
  createTransporter();
  reminderCron();
} catch (e) {
  console.log('Cron not started:', e?.message || e);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

