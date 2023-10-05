import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Order'],
};

const getOrders: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getMany', { schema }, async (req, reply) => {
    const { userId } = req;
    const [sellOrders, buyOrders] = await Promise.all([
      fastify.prisma.order.findMany({
        where: {
          sellerId: userId,
          NOT: { status: 'COMMISSION' },
          AND: { NOT: { status: 'FINISHED' } },
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          createdAt: true,
          trackingNumber: true,
          buyer: { select: { nickname: true, phone: true } },
          Listing: { select: { price: true, title: true, id: true } },
        },
      }),
      await fastify.prisma.order.findMany({
        where: {
          buyerId: userId,
          NOT: { status: 'COMMISSION' },
          AND: { NOT: { status: 'FINISHED' } },
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          createdAt: true,
          trackingNumber: true,
          Listing: {
            select: {
              price: true,
              title: true,
              id: true,
              // phone: true, TODO: fix this
              User: { select: { nickname: true } },
            },
          },
        },
      }),
    ]);

    return reply.send({ sellOrders, buyOrders });
  });
};

export default getOrders;
