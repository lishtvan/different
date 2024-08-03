import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Jobs'],
};

const formatTrackingNumber = (trackingNumber: string) => {
  trackingNumber.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
};

const refusalStatusCodes = ['2', '3', '102', '103', '105', '111'];
const shippingStatusesCodes = ['4', '5', '6', '7', '101'];
const receivalStatusCodes = ['9', '10', '11'];

const getOrder: FastifyPluginAsync = async (fastify) => {
  fastify.post('/tracking', { schema }, async (req, reply) => {
    const orders = await fastify.prisma.order.findMany({
      where: { NOT: [{ status: 'CANCELED' }, { status: 'FINISHED' }] },
      include: { Listing: true },
    });
    if (!orders.length) return reply.send();
    const documents = orders.map((order) => order.trackingNumber);
    const internetDocuments = await fastify.np.client.trackingDocument.getStatusDocuments(
      { documents }
    );
    const trackings = internetDocuments.map((i) => ({
      status: i.status,
      statusCode: i.statusCode,
      trackingNumber: i.number,
    }));

    const statusUpdatePromises = trackings.map((i) => {
      const order = orders.find((order) => order.trackingNumber === i.trackingNumber);
      if (!order) return;

      if (refusalStatusCodes.includes(i.statusCode)) {
        return fastify.prisma.order
          .update({
            where: { trackingNumber: i.trackingNumber },
            data: { status: 'CANCELED' },
            include: { Listing: true },
          })
          .then(async (res) => {
            await fastify.prisma.listing.update({
              where: { id: res.Listing.id },
              data: { status: 'AVAILABLE' },
            });
            await fastify.search.update({ id: res.Listing.id, status: 'AVAILABLE' });
          });
      }
      if (i.statusCode === '1' && i.status.includes('оплату')) {
        const orderDueDate = new Date(order.createdAt);
        orderDueDate.setHours(orderDueDate.getHours() + 2);
        const currentDate = new Date();
        if (currentDate < orderDueDate) return;
        return fastify.np.client.internetDocument.delete({
          documentRefs: order!.intDocRef!,
        });
      }
      if (i.statusCode === '1' && !i.status.includes('оплату')) {
        if (order.status === 'HANDLING') return;
        return fastify.prisma.order
          .update({
            where: { trackingNumber: i.trackingNumber },
            data: { status: 'HANDLING' },
          })
          .then(async () => {
            await fastify.notifications.sendNotification({
              recipientId: order.sellerId,
              title: order.Listing.title,
              // eslint-disable-next-line max-len
              body: `Замовлення оплачено. Відправте по номеру накладної ${formatTrackingNumber(order.trackingNumber)}`,
              data: { type: 'order', orderId: order.id, url: '_' },
            });
            await fastify.notifications.sendNotification({
              recipientId: order.buyerId,
              title: order.Listing.title,
              body: 'Оплата прошла успішно. Очікуйте на відправлення протягом 2 днів.',
              data: { type: 'order', orderId: order.id, url: '_' },
            });
          });
      }
      if (shippingStatusesCodes.includes(i.statusCode)) {
        if (order.status === 'SHIPPING') return;
        return fastify.prisma.order
          .update({
            where: { trackingNumber: i.trackingNumber },
            data: { status: 'SHIPPING' },
          })
          .then(async () => {
            await fastify.notifications.sendNotification({
              recipientId: order.buyerId,
              title: order.Listing.title,
              body: 'Продавець відправив товар. Очікуйте на повідомлення від Нової Пошти',
              data: { type: 'order', orderId: order.id, url: '_' },
            });
          });
      }

      if (receivalStatusCodes.includes(i.statusCode)) {
        return fastify.prisma.order
          .update({
            where: { trackingNumber: i.trackingNumber },
            data: { status: 'FINISHED' },
            include: { Listing: true },
          })
          .then(async (res) => {
            await fastify.prisma.listing.update({
              where: { id: res.Listing.id },
              data: { status: 'SOLD' },
            });
            await fastify.search.update({ id: res.Listing.id, status: 'SOLD' });
          });
      }
    });
    await Promise.allSettled(statusUpdatePromises);

    return reply.send();
  });
};

export default getOrder;
