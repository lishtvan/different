import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Order'],
};

const getOrders: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getMany', { schema }, async (req, reply) => {
    const { userId } = req.cookies;
    const orders = await fastify.prisma.order.findMany({
      where: {
        listing: { userId: Number(userId) },
        NOT: { status: 'COMMISSION', AND: { status: 'FINISHED' } },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        trackingNumber: true,
        buyer: { select: { nickname: true } },
        listing: {
          select: {
            price: true,
            title: true,
            id: true,
          },
        },
      },
    });
    return reply.send({ orders });
  });
};

export default getOrders;
