import { Server } from 'socket.io';

let io: Server | null = null;

export function setIO(server: Server) {
  io = server;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized yet');
  }
  return io;
}

export function broadcastAvailability(eventId: string, available: number) {
  if (!io) return;
  io.to(`event:${eventId}`).emit('availability-update', { eventId, available });
}

export function broadcastPaymentUpdate(userId: string, data: { holdId: string; status: string; ticket?: { id: string; qrCode: string } }) {
  if (!io) return;
  io.to(`user:${userId}`).emit('payment-update', data);
}

export function broadcastAdminStats(stats: { userCount: number; eventCount: number; ticketCount: number; totalRevenueCents: number }) {
  if (!io) return;
  io.to('admin-room').emit('admin-stats-update', stats);
}
