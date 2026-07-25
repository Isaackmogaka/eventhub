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
