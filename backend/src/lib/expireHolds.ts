import { prisma } from './prisma';

export async function expireStaleHolds() {
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
  }

  return result.count;
}
