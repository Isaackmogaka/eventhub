import { Router } from 'express';
import bcrypt from 'bcrypt';
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


router.patch('/me/password', requireAuth, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!valid) {
    return res.status(401).json({
      error: 'Current password is incorrect',
    });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: req.userId,
    },
    data: {
      passwordHash,
    },
  });

  res.json({
    message: 'Password updated successfully',
  });
});

export default router;



router.patch('/payout-number', requireAuth, async (req: AuthRequest, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || !/^2547\d{8}$/.test(phoneNumber)) {
    return res.status(400).json({ error: 'Enter a valid M-Pesa number, e.g. 254712345678' });
  }

  const organizer = await prisma.organizer.findUnique({ where: { userId: req.userId } });
  if (!organizer) return res.status(400).json({ error: 'Only organizers have a payout number' });

  const updated = await prisma.organizer.update({
    where: { userId: req.userId },
    data: { payoutPhoneNumber: phoneNumber },
  });

  res.json({ payoutPhoneNumber: updated.payoutPhoneNumber });
});
