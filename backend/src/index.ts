import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import eventsRoutes from './routes/events';
import holdsRoutes from './routes/holds';
import { expireStaleHolds } from './lib/expireHolds';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/events', holdsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Sweep for expired holds every 60 seconds
  setInterval(() => {
    expireStaleHolds().catch((err) => console.error('Hold expiry sweep failed:', err));
  }, 60 * 1000);
});
