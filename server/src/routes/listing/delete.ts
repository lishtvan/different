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
    const { userId } = req;

    try {
      await fastify.prisma.$transaction(async (tx) => {
        await tx.listing.delete({
          where: { id: listingId, userId, status: 'AVAILABLE' },
        });
        await fastify.search.delete(listingId);
      });
    } catch (e: any) {
      if (e.code === 'P2025' || e.httpStatus === 404) throw fastify.httpErrors.notFound();
      throw e;
    }

    return reply.send({});
  });
};

export default deleteListing;
