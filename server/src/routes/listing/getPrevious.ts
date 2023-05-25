import { FastifyPluginAsync } from 'fastify';

const getListing: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getPrevious', async (req, reply) => {
    const listings = await fastify.prisma.listing.findMany({
      where: { userId: Number(req.cookies.userId) },
      take: -1,
      select: { cardNumber: true },
    });

    if (listings.length === 0) return reply.send({ cardNumber: null });
    return reply.send({ cardNumber: listings[0].cardNumber });
  });
};

export default getListing;
