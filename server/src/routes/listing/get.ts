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
      title: { type: 'string' },
      designer: { type: 'string' },
      description: { type: 'string' },
      tags: { type: 'string' },
      condition: { type: 'string' },
      category: { type: 'string' },
      size: { type: 'string' },
      shipping: { type: 'array', items: { type: 'string' } },
      imageUrls: { type: 'array', items: { type: 'string' } },
      price: { type: 'number' },
      cardNumber: { type: 'number' },
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

    return reply.send(listing);
  });
};

export default getListing;
