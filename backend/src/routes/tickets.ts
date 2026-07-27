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

export default router;
