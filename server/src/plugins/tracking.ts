import { Prisma } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

type OrderWithListing = Prisma.OrderGetPayload<{
  include: { Listing: true };
}>;

type OrderStatusUpdateHandler = (order: OrderWithListing) => void;

const trackingPlugin = (app: FastifyInstance) => {
  const cancel: OrderStatusUpdateHandler = async (order) => {
    const orderRejectedString = 'Замовлення скасовано. Оголошення знову в наявності.';

    await Promise.all([
      app.prisma.order.delete({ where: { trackingNumber: order.trackingNumber } }),
      app.prisma.listing.update({
        where: { id: order.listingId },
        data: { status: 'AVAILABLE' },
      }),
      app.search.update({ id: order.listingId, status: 'AVAILABLE' }),
      app.notifications.sendNotification({
        recipientId: order.sellerId,
        title: order.Listing.title,
        body: orderRejectedString,
        data: { type: 'order', orderId: order.id, url: '_' },
      }),
    ]);
  };

  const paymentTimeExpired = async (order: OrderWithListing) => {
    const orderDueDate = new Date(order.createdAt);
    orderDueDate.setHours(orderDueDate.getHours() + 2);
    const currentDate = new Date();
    if (currentDate < orderDueDate) return;
    await app.np.client.internetDocument.delete({
      documentRefs: order.intDocRef!,
    });
  };

  const payed: OrderStatusUpdateHandler = async (order) => {
    if (order.status === 'HANDLING') return;
    await app.prisma.order.update({
      where: { trackingNumber: order.trackingNumber },
      data: {
        status: 'HANDLING',
        OrderNotification: { create: { userId: order.sellerId } },
      },
    });
    const formattedTrackingNumber = app.np.formatTrackingNumber(order.trackingNumber);
    const orderPayedString = 'Замовлення оплачено. Відправте по номеру накладної';

    await Promise.all([
      app.notifications.sendNotification({
        recipientId: order.sellerId,
        title: order.Listing.title,
        body: `${orderPayedString} ${formattedTrackingNumber}`,
        data: { type: 'order', orderId: order.id, url: '_' },
      }),
      app.notifications.sendNotification({
        recipientId: order.buyerId,
        title: order.Listing.title,
        body: 'Оплата прошла успішно. Очікуйте на відправлення протягом 2 днів.',
        data: { type: 'order', orderId: order.id, url: '_' },
      }),
    ]);
  };

  const shipped: OrderStatusUpdateHandler = async (order) => {
    if (order.status === 'SHIPPING') return;
    await app.prisma.order.update({
      where: { trackingNumber: order.trackingNumber },
      data: {
        status: 'SHIPPING',
        OrderNotification: { create: { userId: order.buyerId } },
      },
    });
    await app.notifications.sendNotification({
      recipientId: order.buyerId,
      title: order.Listing.title,
      body: 'Продавець відправив товар. Очікуйте на повідомлення від Нової Пошти',
      data: { type: 'order', orderId: order.id, url: '_' },
    });
  };

  const received: OrderStatusUpdateHandler = async (order) => {
    if (order.status === 'FINISHED') return;

    await app.prisma.order.update({
      where: { trackingNumber: order.trackingNumber },
      data: {
        status: 'FINISHED',
        Listing: { update: { status: 'SOLD' } },
      },
    });
    await app.search.update({ id: order.listingId, status: 'SOLD' });
    await app.notifications.sendNotification({
      recipientId: order.sellerId,
      title: order.Listing.title,
      body: 'Замовлення виконано. Очікуйте на грошовий переказ',
      data: { type: 'order', orderId: order.id, url: '_' },
    });
  };

  return { cancel, paymentTimeExpired, payed, shipped, received };
};

export default fp(async (fastify) => {
  const tracking = trackingPlugin(fastify);
  fastify.decorate('tracking', tracking);
});

declare module 'fastify' {
  interface FastifyInstance {
    tracking: ReturnType<typeof trackingPlugin>;
  }
}
