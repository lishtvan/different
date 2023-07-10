import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Order'],
};

const getOrders: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getMany', { schema }, async (req, reply) => {
    const { userId } = req.cookies;
    const [sellOrders, buyOrders] = await Promise.all([
      fastify.prisma.order.findMany({
        where: {
          listing: { userId: Number(userId) },
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
          listing: { select: { price: true, title: true, id: true } },
        },
      }),
      await fastify.prisma.order.findMany({
        where: {
          buyerId: Number(userId),
          NOT: { status: 'COMMISSION' },
          AND: { NOT: { status: 'FINISHED' } },
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          createdAt: true,
          trackingNumber: true,
          listing: {
            select: {
              price: true,
              title: true,
              id: true,
              phone: true,
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
