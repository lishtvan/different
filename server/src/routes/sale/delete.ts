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
};

type Schema = { Body: FromSchema<typeof schema.body> };

const deleteSale: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/delete', { schema }, async (req, reply) => {
    const { saleId } = req.body;

    const { imageKeys } = await fastify.prisma.sale.delete({
      where: { id: saleId },
      select: { imageKeys: true },
    });

    if (imageKeys.length) await fastify.s3.deleteImages(imageKeys);

    return reply.send();
  });
};

export default deleteSale;
