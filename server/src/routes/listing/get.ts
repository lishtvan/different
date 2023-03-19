import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Listing'],
  body: {
    type: 'object',
    required: ['listingId'],
    properties: {
      listingId: { type: 'number' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getListing: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { listingId } = req.body;
    const listing = await fastify.prisma.listing.findFirst({
      where: {
        id: listingId,
      },
      select: {
        id: true,
        createdAt: true,
        price: true,
        title: true,
        size: true,
        designer: true,
        condition: true,
        category: true,
        description: true,
        tags: true,
        imageUrls: true,
        status: true,
        sellerId: true,
        cardNumber: true,
        Seller: { select: { id: true, avatarUrl: true, nickname: true } },
      },
    });

    if (!listing) throw fastify.httpErrors.notFound();

    const isOwnListing = listing.sellerId === Number(req.cookies.userId);

    return reply.send({ listing, isOwnListing });
  });
};

export default getListing;
