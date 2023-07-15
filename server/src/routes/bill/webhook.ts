import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { LISTINGS_COLLECTION_NAME } from '../../constants/typesense';

const schema = {
  tags: ['Bill'],
  params: {
    type: 'object',
    required: ['MNBNK_WEBHOOK_KEY'],
    properties: {
      MNBNK_WEBHOOK_KEY: { type: 'string' },
    },
  } as const,
  body: {
    type: 'object',
    required: ['status', 'reference'],
    properties: {
      status: { type: 'string' },
      reference: { type: 'string' },
    },
  } as const,
};

type Schema = {
  Params: FromSchema<typeof schema.params>;
  Body: FromSchema<typeof schema.body>;
};

const getBill: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/webhook/:MNBNK_WEBHOOK_KEY', { schema }, async (req, reply) => {
    const { reference, status } = req.body;
    const { MNBNK_WEBHOOK_KEY } = req.params;
    if (MNBNK_WEBHOOK_KEY !== process.env.MNBNK_WEBHOOK_KEY) {
      throw fastify.httpErrors.forbidden();
    }
    if (status === 'success') {
      const orderIds = reference.split('+');

      await Promise.all([
        fastify.prisma.order.updateMany({
          where: { id: { in: orderIds } },
          data: { status: 'FINISHED' },
        }),
        fastify.prisma.listing.updateMany({
          where: { Order: { id: { in: orderIds } } },
          data: { status: 'SOLD' },
        }),
        fastify.prisma.order
          .findUnique({
            where: { id: orderIds[0] },
            select: { Listing: { select: { userId: true } } },
          })
          .then(async (res) => {
            await fastify.prisma.user.update({
              where: { id: res?.Listing.userId },
              data: { isBill: false },
            });
          }),
      ]);

      const typesenseListingUpdatePromises = orderIds.map((orderId) => {
        const promise = fastify.prisma.order
          .findUnique({
            where: { id: orderId },
            select: { listingId: true, Listing: { select: { userId: true } } },
          })
          .then(async (order) => {
            await fastify.typesense
              .collections(LISTINGS_COLLECTION_NAME)
              .documents()
              .update({ status: 'SOLD', id: order?.listingId.toString() });
          });
        return promise;
      });

      await Promise.all(typesenseListingUpdatePromises);
    }
    return reply.send();
  });
};

export default getBill;
