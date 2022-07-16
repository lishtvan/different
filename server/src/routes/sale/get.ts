import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Sale'],
  body: {
    type: 'object',
    required: ['saleId'],
    properties: {
      saleId: { type: 'number' },
    },
  } as const,
  response: {
    '2xx': {
      name: { type: 'string' },
      description: { type: 'string' },
      condition: { type: 'string' },
      size: { type: 'string' },
      imageKeys: { type: 'array', items: { type: 'string' } },
      trackNumber: { type: 'string', nullable: true },
    },
  },
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getSale: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { saleId } = req.body;

    const sale = await fastify.prisma.sale.findFirst({
      where: {
        id: saleId,
      },
    });

    return reply.send(sale);
  });
};

export default getSale;
