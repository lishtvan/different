import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Bill'],
  body: {
    type: 'object',
    properties: {
      nickname: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getBill: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { userId } = req.cookies;

    const unpaidOrders = await fastify.prisma.order.findMany({
      where: { status: 'COMMISSION', listing: { userId: Number(userId) } },
    });

    return reply.send(unpaidOrders);
  });
};

export default getBill;
