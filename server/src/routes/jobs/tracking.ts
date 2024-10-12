import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Jobs'],
};

const refusalStatusCodes = ['2', '3', '102', '103', '105', '111'];
const shippingStatusesCodes = ['4', '5', '6', '7', '101'];
const receivalStatusCodes = ['9', '10', '11'];

const tracking: FastifyPluginAsync = async (fastify) => {
  fastify.post('/tracking', { schema }, async (req, reply) => {
    const orders = await fastify.prisma.order.findMany({
      where: { NOT: { status: 'FINISHED' } },
      include: { Listing: true },
    });
    if (!orders.length) return reply.send();
    const documents = orders.map((order) => order.trackingNumber);
    const internetDocuments = await fastify.np.client.trackingDocument.getStatusDocuments(
      { documents }
    );

    const statusUpdatePromises = internetDocuments
      .map((i) => {
        const order = orders.find((order) => order.trackingNumber === i.number);
        if (!order) return;

        if (refusalStatusCodes.includes(i.statusCode)) {
          return fastify.tracking.cancel(order);
        }
        if (i.statusCode === '1' && i.paymentStatus !== 'PAYED') {
          return fastify.tracking.paymentTimeExpired(order);
        }
        if (i.statusCode === '1' && i.paymentStatus === 'PAYED') {
          return fastify.tracking.payed(order);
        }
        if (shippingStatusesCodes.includes(i.statusCode)) {
          return fastify.tracking.shipped(order);
        }
        if (receivalStatusCodes.includes(i.statusCode)) {
          return fastify.tracking.received(order);
        }
      })
      .filter(Boolean);

    const results = await Promise.allSettled(statusUpdatePromises);
    const errors = results.filter((i) => i.status === 'rejected');
    if (errors.length) {
      fastify.log.error({ errors });
      fastify.alert(`Tracking job failed \n${JSON.stringify({ errors })}`);
    }
    return reply.send();
  });
};

export default tracking;
