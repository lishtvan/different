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
    const { userId: ownUserId } = req;

    const listing = await fastify.prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        createdAt: true,
        price: true,
        title: true,
        size: true,
        designer: true,
        phone: true,
        condition: true,
        category: true,
        description: true,
        tags: true,
        imageUrls: true,
        status: true,
        userId: true,
        cardNumber: true,
        User: { select: { id: true, avatarUrl: true, nickname: true } },
      },
    });

    if (!listing) throw fastify.httpErrors.notFound();

    const [sellerAvailableListingsCount, sellerSoldListingsCount] = await Promise.all([
      fastify.prisma.listing.count({
        where: { status: 'AVAILABLE', User: { nickname: listing?.User.nickname } },
      }),
      fastify.prisma.listing.count({
        where: { status: 'SOLD', User: { nickname: listing?.User.nickname } },
      }),
    ]);

    const isOwnListing = listing.userId === ownUserId;

    return reply.send({
      listing,
      isOwnListing,
      sellerAvailableListingsCount,
      sellerSoldListingsCount,
    });
  });
};

export default getListing;
