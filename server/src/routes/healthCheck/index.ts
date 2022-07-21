import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string' },
    },
  } as const,
  response: {
    '2xx': {
      id: { type: 'number' },
      createdAt: { type: 'string' },
      email: { type: 'string' },
      name: { type: 'string', nullable: true },
    },
  },
};

type Schema = { Body: FromSchema<typeof schema.body> };

const healthCheck: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/', { schema }, async (req) => {
    const { email } = req.body;

    const user = await fastify.prisma.user.findUnique({
      where: { email },
    });

    return user;
  });
};

export default healthCheck;
