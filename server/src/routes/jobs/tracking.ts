import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Jobs'],
};

const formatTrackingNumber = (trackingNumber: string) => {
  trackingNumber.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
};

const getOrder: FastifyPluginAsync = async (fastify) => {
  fastify.post('/tracking', { schema }, async (req, reply) => {
    const orders = await fastify.prisma.order.findMany({
      where: {
        NOT: [{ status: 'CANCELED' }, { status: 'FINISHED' }],
      },
      include: {
        Listing: true,
      },
    });

    await fastify.notifications.sendNotification({
      recipientId: orders[0].sellerId, // or buyerId
      title: orders[0].Listing.title,
      // eslint-disable-next-line max-len
      body: `Замовлення оплачено, відправте по номеру накладної ${formatTrackingNumber(orders[0].trackingNumber)}`,
      data: { type: 'order', orderId: orders[0].id, url: '_' },
    });
    return reply.send();
  });
};

export default getOrder;
