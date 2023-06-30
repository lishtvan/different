import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Order'],
  body: {
    type: 'object',
    required: ['orderId'],
    properties: {
      orderId: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getOrder: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { orderId } = req.body;
    const order = await fastify.prisma.order.findUnique({
      where: { id: orderId },
    });
    return reply.send({ order });
  });
};

export default getOrder;
