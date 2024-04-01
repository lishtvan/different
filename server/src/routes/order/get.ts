import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Order'],
  body: {
    type: 'object',
    required: ['orderId'],
    properties: {
      orderId: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getOrder: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { orderId } = req.body;
    const reqUserId = req.userId;

    const order = await fastify.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        trackingNumber: true,
        Listing: {
          select: { id: true, imageUrls: true, designer: true, title: true, price: true },
        },
        buyer: { select: { nickname: true, phone: true, avatarUrl: true, id: true } },
        seller: { select: { nickname: true, phone: true, avatarUrl: true, id: true } },
      },
    });

    if (!order) throw fastify.httpErrors.notFound();

    const orderType = order.buyer.id === reqUserId ? 'buy' : 'sell';
    return reply.send({ order, orderType });
  });
};

export default getOrder;
