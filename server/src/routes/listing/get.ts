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
  response: {
    '2xx': {
      listing: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          designer: { type: 'string' },
          description: { type: 'string' },
          tags: { type: 'string' },
          condition: { type: 'string' },
          category: { type: 'string' },
          size: { type: 'string' },
          imageUrls: { type: 'array', items: { type: 'string' } },
          price: { type: 'number' },
        },
      },
      seller: {
        type: 'object',
        properties: {
          nickname: { type: 'string' },
          avatarUrl: { type: 'string', nullable: true },
          name: { type: 'string', nullable: true },
          id: { type: 'number' },
        },
      },
      isOwnListing: {
        type: 'boolean',
      },
    },
  },
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getListing: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { listingId } = req.body;
    const listing = await fastify.prisma.listing.findFirst({
      where: {
        id: listingId,
      },
    });
    if (!listing) throw fastify.httpErrors.notFound();

    const seller = await fastify.prisma.user.findFirst({
      where: {
        id: listing?.userId,
      },
    });

    return reply.send({
      listing,
      seller,
      isOwnListing: listing.userId === Number(req.cookies.userId),
    });
  });
};

export default getListing;
