import { FastifyPluginAsync } from 'fastify';

const getPreviousListing: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getPrevious', async (req, reply) => {
    const { userId } = req;

    const listings = await fastify.prisma.listing.findMany({
      where: { userId },
      take: -1,
      select: { cardNumber: true, phone: true },
    });

    if (listings.length === 0) return reply.send({ cardNumber: null });
    return reply.send({
      cardNumber: listings[0].cardNumber,
      phone: listings[0].phone,
    });
  });
};

export default getPreviousListing;
