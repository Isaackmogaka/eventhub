import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import intasend from '../lib/intasend';

const router = Router();

router.post('/:holdId/pay', requireAuth, async (req: AuthRequest, res) => {
  const { holdId } = req.params;
  const { phoneNumber } = req.body;

  if (!phoneNumber || !/^2547\d{8}$/.test(phoneNumber)) {
    return res.status(400).json({ error: 'Please provide a valid M-Pesa number in the format 2547XXXXXXXX' });
  }

  const hold = await prisma.ticketHold.findUnique({
    where: { id: holdId },
    include: { event: true },
  });

  if (!hold) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  if (hold.userId !== req.userId) {
    return res.status(403).json({ error: 'This reservation does not belong to you' });
  }

  if (hold.status !== 'ACTIVE') {
    return res.status(400).json({ error: 'This reservation is no longer active' });
  }

  if (new Date(hold.expiresAt) < new Date()) {
    return res.status(400).json({ error: 'This reservation has expired' });
  }

  const existingPayment = await prisma.payment.findUnique({ where: { holdId } });
  if (existingPayment) {
    return res.status(409).json({ error: 'A payment attempt already exists for this reservation' });
  }

  const amountCents = hold.event.priceCents * hold.quantity;

  try {
    const collection = intasend.collection();
    const response = await collection.mpesaStkPush({
      first_name: req.userId,
      last_name: 'Attendee',
      email: 'noreply@eventhub.local',
      host: process.env.BACKEND_URL,
      amount: amountCents / 100,
      phone_number: phoneNumber,
      api_ref: holdId,
    });

    const payment = await prisma.payment.create({
      data: {
        holdId,
        userId: req.userId!,
        eventId: hold.eventId,
        amountCents,
        phoneNumber,
        invoiceId: response.invoice.invoice_id,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      payment,
      message: 'Check your phone to complete the M-Pesa payment.',
    });
  } catch (err) {
    console.error('IntaSend STK push failed:', err);
    res.status(500).json({ error: 'Failed to initiate payment. Please try again.' });
  }
});

router.get('/:holdId/status', requireAuth, async (req: AuthRequest, res) => {
  const { holdId } = req.params;

  const payment = await prisma.payment.findUnique({
    where: { holdId },
    include: { ticket: true },
  });

  if (!payment) {
    return res.status(404).json({ error: 'No payment found for this reservation' });
  }

  if (payment.userId !== req.userId) {
    return res.status(403).json({ error: 'This payment does not belong to you' });
  }

  res.json({
    status: payment.status,
    ticket: payment.ticket
      ? { id: payment.ticket.id, qrCode: payment.ticket.qrCode }
      : null,
  });
});

export default router;
