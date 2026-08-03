import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth';
import eventsRoutes from './routes/events';
import holdsRoutes from './routes/holds';
import paymentsRoutes from './routes/payments';
import webhooksRoutes from './routes/webhooks';
import ticketsRoutes from './routes/tickets';
import adminRoutes from './routes/admin';
import profileRoutes from './routes/profile';
import { expireStaleHolds } from './lib/expireHolds';
import { setIO } from './lib/socket';

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
app.use('/payments', paymentsRoutes);
app.use('/webhooks', webhooksRoutes);
app.use('/profile', profileRoutes);
app.use('/tickets', ticketsRoutes);
app.use('/admin', adminRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL },
});

setIO(io);

io.on('connection', (socket) => {
  socket.on('join-event', (eventId: string) => {
    socket.join(`event:${eventId}`);
  });

  socket.on('leave-event', (eventId: string) => {
    socket.leave(`event:${eventId}`);
  });

  socket.on('join-user', (userId: string) => {
    socket.join(`user:${userId}`);
  });

  socket.on('join-admin', () => {
    socket.join('admin-room');
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  setInterval(() => {
    expireStaleHolds().catch((err) => console.error('Hold expiry sweep failed:', err));
  }, 60 * 1000);
});
