import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Sale'],
  body: {
    type: 'object',
    required: ['name', 'accountId', 'size', 'condition', 'description', 'imageKeys'],
    properties: {
      accountId: { type: 'number' },
      imageKeys: {
        type: 'array',
        minItems: 3,
        maxItems: 8,
        items: {
          type: 'string',
        },
      },
      name: { type: 'string', minLength: 5, maxLength: 30 },
      description: { type: 'string', minLength: 5, maxLength: 300 },
      size: { type: 'string', minLength: 1, maxLength: 3 },
      condition: { type: 'string', minLength: 3, maxLength: 100 },
      trackNumber: { type: 'string', nullable: true },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const createSale: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/create', { schema }, async (req, reply) => {
    const { name, size, description, accountId, condition, imageKeys, trackNumber } =
      req.body;

    await fastify.prisma.sale.create({
      data: {
        name,
        size,
        description,
        accountId,
        condition,
        imageKeys,
        trackNumber,
      },
    });

    return reply.send();
  });
};

export default createSale;
