import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      phone: true,
      bio: true,
      location: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});


router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
  const { name, phone, bio, location, avatarUrl } = req.body;

  const updatedUser = await prisma.user.update({
    where: {
      id: req.userId,
    },
    data: {
      name,
      phone,
      bio,
      location,
      avatarUrl,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      phone: true,
      bio: true,
      location: true,
      createdAt: true,
    },
  });

  res.json(updatedUser);
});

export default router;

