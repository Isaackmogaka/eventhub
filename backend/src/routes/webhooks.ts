import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { broadcastAvailability, broadcastPaymentUpdate } from '../lib/socket';

const router = Router();

router.post('/intasend', async (req, res) => {
  const { challenge, invoice_id, state, api_ref } = req.body;

  if (challenge !== process.env.INTASEND_WEBHOOK_CHALLENGE) {
    console.error('Webhook challenge mismatch — rejecting request');
    return res.status(401).json({ error: 'Invalid challenge' });
  }

  const payment = await prisma.payment.findUnique({
    where: { invoiceId: invoice_id },
    include: { hold: true, event: true },
  });

  if (!payment) {
    console.error('Webhook received for unknown invoice:', invoice_id);
    return res.status(404).json({ error: 'Payment not found' });
  }

  if (payment.status !== 'PENDING') {
    return res.status(200).json({ message: 'Already processed' });
  }

  if (state === 'COMPLETE') {
    const qrCode = `EVH-${payment.id.slice(0, 8).toUpperCase()}`;

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      });

      await tx.ticketHold.update({
        where: { id: payment.holdId },
        data: { status: 'CONVERTED' },
      });

      await tx.ticket.create({
        data: {
          eventId: payment.eventId,
          userId: payment.userId,
          paymentId: payment.id,
          quantity: payment.hold.quantity,
          qrCode,
          status: 'CONFIRMED',
        },
      });

      await tx.event.update({
        where: { id: payment.eventId },
        data: { ticketsSold: { increment: payment.hold.quantity } },
      });
    });

    const updatedEvent = await prisma.event.findUnique({ where: { id: payment.eventId } });
    const activeHolds = await prisma.ticketHold.aggregate({
      where: { eventId: payment.eventId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      _sum: { quantity: true },
    });
    const heldQty = activeHolds._sum.quantity || 0;
    const available = updatedEvent!.totalTickets - updatedEvent!.ticketsSold - heldQty;
    broadcastAvailability(payment.eventId, available);

    console.log(`Payment ${payment.id} completed, ticket issued: ${qrCode}`);

    const newTicket = await prisma.ticket.findUnique({ where: { paymentId: payment.id } });
    broadcastPaymentUpdate(payment.userId, {
      holdId: payment.holdId,
      status: 'COMPLETED',
      ticket: newTicket ? { id: newTicket.id, qrCode: newTicket.qrCode } : undefined,
    });
  } else if (state === 'FAILED') {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });
    console.log(`Payment ${payment.id} failed`);

    broadcastPaymentUpdate(payment.userId, {
      holdId: payment.holdId,
      status: 'FAILED',
    });
  }

  res.status(200).json({ received: true });
});

export default router;
