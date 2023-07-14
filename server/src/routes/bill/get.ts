import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Bill'],
};

const getBill: FastifyPluginAsync = async (fastify) => {
  fastify.post('/get', { schema }, async (req, reply) => {
    const { userId } = req.cookies;

    const bills = await fastify.prisma.listing.findMany({
      where: {
        userId: Number(userId),
        Order: { status: 'COMMISSION' },
      },
      select: {
        price: true,
        title: true,
        imageUrls: true,
      },
    });

    return reply.send(bills);
  });
};

export default getBill;
