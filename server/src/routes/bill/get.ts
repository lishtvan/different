import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Bill'],
};

const getBill: FastifyPluginAsync = async (fastify) => {
  fastify.post('/get', { schema }, async (req, reply) => {
    const { userId } = req;

    const soldItems = await fastify.prisma.listing.findMany({
      where: { userId, Order: { status: 'COMMISSION' } },
      select: { id: true, price: true, title: true },
    });

    if (soldItems.length === 0) {
      await fastify.prisma.user.update({
        where: { id: userId },
        data: { isBill: false },
      });
      throw fastify.httpErrors.badRequest();
    }

    let totalCommission = 0;

    const soldItemsWithCommission = soldItems.map((item) => {
      const commission = Math.ceil((item.price / 100) * 5);
      totalCommission += commission;
      return { ...item, commission };
    });

    return reply.send({ soldItems: soldItemsWithCommission, totalCommission });
  });
};

export default getBill;
