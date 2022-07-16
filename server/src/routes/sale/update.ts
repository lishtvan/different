import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Sale'],
  description: 'Dont forget to delete old images from s3. See route /image/delete',
  body: {
    type: 'object',
    required: ['saleId'],
    properties: {
      saleId: { type: 'number' },
      name: { type: 'string', minLength: 1, maxLength: 30 },
      description: { type: 'string', minLength: 1, maxLength: 300 },
      size: { type: 'string', minLength: 1 },
      condition: { type: 'string', minLength: 1, maxLength: 100 },
      imageKeys: {
        type: 'array',
        minItems: 3,
        maxItems: 8,
        items: {
          type: 'string',
        },
      },
      trackNumber: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const updateSale: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/update', { schema }, async (req, reply) => {
    const { name, size, trackNumber, description, saleId, condition, imageKeys } =
      req.body;

    await fastify.prisma.sale.update({
      where: {
        id: saleId,
      },
      data: {
        name,
        size,
        description,
        condition,
        imageKeys,
        trackNumber,
      },
    });

    return reply.send();
  });
};

export default updateSale;
