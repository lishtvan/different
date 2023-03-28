import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { LISTINGS_COLLECTION_NAME } from '../../constants/typesense';

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

    try {
      await fastify.prisma.user.update({
        where: { id: Number(req.cookies.userId) },
        data: { Listings: { delete: { id: listingId } } },
      });
      await fastify.typesense
        .collections(LISTINGS_COLLECTION_NAME)
        .documents(listingId.toString())
        .delete();
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2017') {
        throw fastify.httpErrors.notFound();
      }
      throw e;
    }

    return reply.send();
  });
};

export default deleteListing;
