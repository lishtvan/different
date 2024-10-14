import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Listing'],
  body: {
    type: 'object',
    required: ['text', 'listingId'],
    properties: {
      listingId: { type: 'number' },
      text: {
        type: 'string',
        maxLength: 1000,
      },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const reportListing: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/report', { schema }, async (req, reply) => {
    const { userId } = req;
    const { text, listingId } = req.body;
    fastify.alert(`userId: ${userId} \nlistingId: ${listingId} \n${text}`);

    return reply.send({});
  });
};

export default reportListing;
