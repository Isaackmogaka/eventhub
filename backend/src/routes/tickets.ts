import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/mine', requireAuth, async (req: AuthRequest, res) => {
  const tickets = await prisma.ticket.findMany({
    where: { userId: req.userId },
    include: { event: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json(tickets);
});

router.post('/check-in', requireAuth, async (req: AuthRequest, res) => {
  if (req.role !== 'ORGANIZER' && req.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only organizers or admins can check in tickets' });
  }

  const { qrCode } = req.body;
  if (!qrCode) return res.status(400).json({ error: 'QR code is required' });

  const ticket = await prisma.ticket.findUnique({
    where: { qrCode },
    include: { event: true, user: { select: { name: true, email: true } } },
  });

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  if (ticket.status === 'CHECKED_IN') {
    return res.status(409).json({ error: `Already checked in at ${ticket.checkedInAt?.toLocaleString()}`, ticket });
  }

  if (ticket.status === 'CANCELLED') {
    return res.status(400).json({ error: 'This ticket was cancelled' });
  }

  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: 'CHECKED_IN', checkedInAt: new Date() },
    include: { event: true, user: { select: { name: true, email: true } } },
  });

  res.json({ message: 'Checked in successfully', ticket: updated });
});

router.get('/summary', requireAuth, async (req: AuthRequest, res) => {
  const [ticketCount, payments] = await Promise.all([
    prisma.ticket.count({ where: { userId: req.userId, status: { not: 'CANCELLED' } } }),
    prisma.payment.findMany({ where: { userId: req.userId, status: 'COMPLETED' }, select: { amountCents: true } }),
  ]);
  const totalSpentCents = payments.reduce((sum, p) => sum + p.amountCents, 0);
  res.json({ ticketCount, totalSpentCents });
});

export default router;
