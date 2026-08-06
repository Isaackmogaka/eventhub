import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Public: list published events
router.get('/', async (req, res) => {
  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { startsAt: 'asc' },
  });
  res.json(events);
});

// Public: single event
router.get('/:id', async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

// Organizer only: create event
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  if (req.role !== 'ORGANIZER') {
    return res.status(403).json({ error: 'Only organizers can create events' });
  }

  const organizer = await prisma.organizer.findUnique({ where: { userId: req.userId } });
  if (!organizer) return res.status(400).json({ error: 'Organizer profile not found' });

  const { title, description, category, location, isOnline, startsAt, priceCents, totalTickets, latitude, longitude } = req.body;

  if (!title || !startsAt || priceCents == null || !totalTickets) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const event = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      title,
      description,
      category,
      location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      isOnline: !!isOnline,
      startsAt: new Date(startsAt),
      priceCents,
      totalTickets,
      status: 'PUBLISHED',
    },
  });

  res.status(201).json(event);
});

router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const event = await prisma.event.findUnique({ where: { id }, include: { organizer: true } });

  if (!event) return res.status(404).json({ error: 'Event not found' });

  const isOwner = event.organizer.userId === req.userId;
  if (!isOwner && req.role !== 'ADMIN') {
    return res.status(403).json({ error: 'You can only edit your own events' });
  }

  const { title, description, category, location, latitude, longitude, isOnline, startsAt, priceCents, totalTickets } = req.body;

  if (totalTickets !== undefined && totalTickets < event.ticketsSold) {
    return res.status(400).json({ error: `Cannot set total tickets below ${event.ticketsSold} already sold` });
  }

  const updated = await prisma.event.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(location !== undefined && { location }),
      ...(latitude !== undefined && { latitude: latitude ? parseFloat(latitude) : null }),
      ...(longitude !== undefined && { longitude: longitude ? parseFloat(longitude) : null }),
      ...(isOnline !== undefined && { isOnline }),
      ...(startsAt !== undefined && { startsAt: new Date(startsAt) }),
      ...(priceCents !== undefined && { priceCents }),
      ...(totalTickets !== undefined && { totalTickets }),
    },
  });

  res.json(updated);
});

export default router;
