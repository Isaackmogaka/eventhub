import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { broadcastAvailability } from '../lib/socket';

const router = Router();

const HOLD_DURATION_MINUTES = 10;

router.post('/:eventId/hold', requireAuth, async (req: AuthRequest, res) => {
  const eventId = String(req.params.eventId);
  const { quantity } = req.body;

  const qty = parseInt(quantity, 10);
  if (!qty || qty < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  try {
    const hold = await prisma.$transaction(async (tx) => {
      // Lock the event row so no other transaction can read/write it until we're done.
      const events = await tx.$queryRaw<{ id: string; totalTickets: number; ticketsSold: number }[]>`
        SELECT id, "totalTickets", "ticketsSold" FROM "Event" WHERE id = ${eventId} FOR UPDATE
      `;

      const event = events[0];
      if (!event) {
        throw new Error('EVENT_NOT_FOUND');
      }

      // Sum quantity from all currently active, non-expired holds for this event.
      const activeHolds = await tx.ticketHold.aggregate({
        where: {
          eventId,
          status: 'ACTIVE',
          expiresAt: { gt: new Date() },
        },
        _sum: { quantity: true },
      });

      const heldQuantity = activeHolds._sum?.quantity ?? 0;
      const available = event.totalTickets - event.ticketsSold - heldQuantity;

      if (qty > available) {
        throw new Error('NOT_ENOUGH_TICKETS');
      }

      const expiresAt = new Date(Date.now() + HOLD_DURATION_MINUTES * 60 * 1000);

      return tx.ticketHold.create({
        data: {
          eventId,
          userId: req.userId!,
          quantity: qty,
          expiresAt,
          status: 'ACTIVE',
        },
      });
    });

    const events = await prisma.event.findUnique({ where: { id: eventId } });
    const activeHolds = await prisma.ticketHold.aggregate({
      where: { eventId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      _sum: { quantity: true },
    });
    const heldQty = activeHolds._sum?.quantity ?? 0;
    const stillAvailable = events!.totalTickets - events!.ticketsSold - heldQty;
    broadcastAvailability(eventId, stillAvailable);

    res.status(201).json(hold);
  } catch (err) {
    if (err instanceof Error && err.message === 'EVENT_NOT_FOUND') {
      return res.status(404).json({ error: 'Event not found' });
    }
    if (err instanceof Error && err.message === 'NOT_ENOUGH_TICKETS') {
      return res.status(409).json({ error: 'Not enough tickets available' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create hold' });
  }
});

router.post('/holds/:holdId/cancel', requireAuth, async (req: AuthRequest, res) => {
  const holdId = String(req.params.holdId);

  const hold = await prisma.ticketHold.findUnique({ where: { id: holdId } });

  if (!hold) {
    return res.status(404).json({ error: 'Hold not found' });
  }

  if (hold.userId !== req.userId) {
    return res.status(403).json({ error: 'You can only cancel your own reservation' });
  }

  if (hold.status !== 'ACTIVE') {
    return res.status(400).json({ error: 'This reservation is no longer active' });
  }

  const updated = await prisma.ticketHold.update({
    where: { id: holdId },
    data: { status: 'CANCELLED' },
  });

  const event = await prisma.event.findUnique({ where: { id: updated.eventId } });
  const activeHolds = await prisma.ticketHold.aggregate({
    where: { eventId: updated.eventId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
    _sum: { quantity: true },
  });
  const heldQty = activeHolds._sum.quantity || 0;
  const stillAvailable = event!.totalTickets - event!.ticketsSold - heldQty;
  broadcastAvailability(updated.eventId, stillAvailable);

  res.json(updated);
});

export default router;
