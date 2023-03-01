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

const deleteListing: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/delete', { schema }, async (req, reply) => {
    const { listingId } = req.body;

    await fastify.prisma.user.update({
      where: { id: Number(req.cookies.userId) },
      data: { Listings: { delete: { id: listingId } } },
    });

    return reply.send();
  });
};

export default deleteListing;
