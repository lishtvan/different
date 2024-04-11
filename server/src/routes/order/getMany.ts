import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Order'],
};

const getOrders: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getMany', { schema }, async (req, reply) => {
    const reqUserId = req.userId;

    const select = {
      id: true,
      status: true,
      Listing: { select: { price: true, title: true, imageUrls: true, designer: true } },
    };

    const user = await fastify.prisma.user.findUnique({
      where: { id: reqUserId },
      select: {
        sellOrders: { select, orderBy: { createdAt: 'desc' } },
        buyOrders: { select, orderBy: { createdAt: 'desc' } },
      },
    });

    return reply.send({ sellOrders: user?.sellOrders, buyOrders: user?.buyOrders });
  });
};

export default getOrders;
