import { prisma } from './prisma';
import { broadcastAvailability } from './socket';

export async function expireStaleHolds() {
  const staleHolds = await prisma.ticketHold.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { lt: new Date() },
    },
    select: { eventId: true },
    distinct: ['eventId'],
  });

  const result = await prisma.ticketHold.updateMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { lt: new Date() },
    },
    data: {
      status: 'EXPIRED',
    },
  });

  if (result.count > 0) {
    console.log(`Expired ${result.count} stale hold(s)`);

    for (const { eventId } of staleHolds) {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      const activeHolds = await prisma.ticketHold.aggregate({
        where: { eventId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
        _sum: { quantity: true },
      });
      const heldQty = activeHolds._sum.quantity || 0;
      const stillAvailable = event!.totalTickets - event!.ticketsSold - heldQty;
      broadcastAvailability(eventId, stillAvailable);
    }
  }

  return result.count;
}
