import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['User'],
  body: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: { type: 'number' },
    },
  } as const,
  response: {
    '2xx': {
      bio: { type: 'string', nullable: true },
      nickname: { type: 'string' },
      name: { type: 'string', nullable: true },
      avatarUrl: { type: 'string', nullable: true },
      location: { type: 'string', nullable: true },
    },
  },
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getUser: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { userId } = req.body;

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
      select: {
        nickname: true,
        bio: true,
        avatarUrl: true,
        name: true,
        location: true,
      },
    });
    if (!user) throw fastify.httpErrors.notFound();

    return reply.send(user);
  });
};

export default getUser;
