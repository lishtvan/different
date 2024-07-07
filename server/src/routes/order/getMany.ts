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
      OrderNotification: { where: { userId: reqUserId } },
      Listing: {
        select: { price: true, title: true, imageUrls: true, designer: true },
      },
    };

    const user = await fastify.prisma.user.findUnique({
      where: { id: reqUserId },
      select: {
        sellOrders: { select, orderBy: { createdAt: 'desc' } },
        buyOrders: { select, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!user) throw fastify.httpErrors.notFound();

    let sellNotificationCount = 0;
    user.sellOrders.forEach((o) => {
      if (o.OrderNotification.length) sellNotificationCount += 1;
    });

    let buyNotificationCount = 0;
    user.buyOrders.forEach((o) => {
      if (o.OrderNotification.length) buyNotificationCount += 1;
    });

    return reply.send({
      sellOrders: user.sellOrders,
      buyOrders: user.buyOrders,
      sellNotificationCount,
      buyNotificationCount,
    });
  });
};

export default getOrders;
