import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Listing'],
  body: {
    type: 'object',
    required: ['userIdToBlock'],
    properties: {
      userIdToBlock: { type: 'number' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const reportListing: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/block', { schema }, async (req, reply) => {
    const { userId } = req;
    const { userIdToBlock } = req.body;
    await fastify.prisma.blockedUser.create({
      data: { blockerId: userId, blockedId: userIdToBlock },
    });

    return reply.send({});
  });
};

export default reportListing;
