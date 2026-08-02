import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', async (req, res) => {
  const [userCount, eventCount, ticketCount, payments] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.ticket.count(),
    prisma.payment.findMany({ where: { status: 'COMPLETED' }, select: { amountCents: true } }),
  ]);

  const totalRevenueCents = payments.reduce((sum, p) => sum + p.amountCents, 0);

  res.json({ userCount, eventCount, ticketCount, totalRevenueCents });
});

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  res.json(users);
});

router.get('/events', async (req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: { organizer: { include: { user: { select: { name: true, email: true } } } } },
  });
  res.json(events);
});

router.patch('/events/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['DRAFT', 'PUBLISHED', 'CANCELLED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const event = await prisma.event.update({ where: { id }, data: { status } });
  res.json(event);
});

router.get('/payments', async (req, res) => {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { event: { select: { title: true } }, user: { select: { name: true, email: true } } },
  });
  res.json(payments);
});

export default router;
