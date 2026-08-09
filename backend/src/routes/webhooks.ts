import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { broadcastAvailability, broadcastPaymentUpdate, broadcastAdminStats } from '../lib/socket';
import intasend from '../lib/intasend';

const router = Router();

router.post('/intasend', async (req, res) => {
  const { challenge, invoice_id, state, api_ref, tracking_id, status, transactions } = req.body;

  if (challenge !== process.env.INTASEND_WEBHOOK_CHALLENGE) {
    console.error('Webhook challenge mismatch — rejecting request');
    return res.status(401).json({ error: 'Invalid challenge' });
  }

  // Send Money (payout) event — distinguished by tracking_id + transactions array
  if (tracking_id && transactions) {
    const payout = await prisma.payout.findUnique({ where: { intasendRef: tracking_id } });
    if (!payout) {
      console.log('Payout webhook for unknown tracking_id:', tracking_id);
      return res.status(200).json({ received: true });
    }
    if (payout.status !== 'PENDING') {
      return res.status(200).json({ message: 'Already processed' });
    }

    const txStatus = transactions[0]?.status;
    const newStatus = txStatus === 'Successful' ? 'COMPLETED' : txStatus ? 'FAILED' : payout.status;

    if (newStatus !== payout.status) {
      await prisma.payout.update({ where: { id: payout.id }, data: { status: newStatus } });
      console.log(`Payout ${payout.id} updated to ${newStatus}`);
    }
    return res.status(200).json({ received: true });
  }


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

    // Trigger organizer payout (5% platform fee, 95% to organizer)
    const eventWithOrganizer = await prisma.event.findUnique({
      where: { id: payment.eventId },
      include: { organizer: true },
    });

    if (eventWithOrganizer?.organizer.payoutPhoneNumber) {
      const MIN_FEE_CENTS = 500; // KES 5 minimum, covers disbursement cost on cheap tickets
      const feeCents = Math.max(Math.round(payment.amountCents * 0.05), MIN_FEE_CENTS);
      const payoutCents = payment.amountCents - feeCents;

      try {
        const payoutsClient = intasend.payouts();
        const payoutResponse = await payoutsClient.mpesa({
          currency: 'KES',
          requires_approval: 'NO',
          transactions: [{
            name: 'Organizer Payout',
            account: eventWithOrganizer.organizer.payoutPhoneNumber,
            amount: (payoutCents / 100).toString(),
            narrative: `Payout for ${eventWithOrganizer.title}`,
          }],
        });

        await prisma.payout.create({
          data: {
            paymentId: payment.id,
            organizerId: eventWithOrganizer.organizerId,
            amountCents: payoutCents,
            feeCents,
            phoneNumber: eventWithOrganizer.organizer.payoutPhoneNumber,
            intasendRef: payoutResponse?.tracking_id || null,
            status: 'PENDING',
          },
        });

        console.log(`Payout initiated for organizer ${eventWithOrganizer.organizerId}: KES ${payoutCents / 100}`);
      } catch (payoutErr) {
        console.error('Payout failed:', payoutErr);
      }
    } else {
      console.log(`No payout number set for organizer of event ${payment.eventId} — skipping payout`);
    }

    const [userCount, eventCount, ticketCount, completedPayments] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.ticket.count(),
      prisma.payment.findMany({ where: { status: 'COMPLETED' }, select: { amountCents: true } }),
    ]);
    broadcastAdminStats({
      userCount,
      eventCount,
      ticketCount,
      totalRevenueCents: completedPayments.reduce((sum, p) => sum + p.amountCents, 0),
    });

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
