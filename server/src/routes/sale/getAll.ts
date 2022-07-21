import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Sale'],
  body: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: { type: 'number' },
      cursor: { type: 'number' },
    },
  } as const,
  response: {
    '2xx': {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          size: { type: 'string' },
          name: { type: 'string' },
          condition: { type: 'string' },
          imageKeys: { type: 'array', items: { type: 'string' } },
          trackNumber: { type: 'string', nullable: true },
        },
      },
    },
  },
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getAllSales: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/getAll', { schema }, async (req, reply) => {
    const { userId, cursor } = req.body;

    const sales = await fastify.prisma.sale.findMany({
      where: {
        userId,
      },
      take: 12,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        size: true,
        name: true,
        condition: true,
        description: true,
        imageKeys: true,
        trackNumber: true,
      },
    });

    return reply.send(sales);
  });
};

export default getAllSales;
