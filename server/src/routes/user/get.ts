import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['User'],
  body: {
    type: 'object',
    properties: {
      nickname: { type: 'string' },
      userId: { type: 'number' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getUser: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { nickname } = req.body;
    const ownUserId = Number(req.cookies.userId);

    const user = await fastify.prisma.user.findUnique({
      where: { nickname },
      select: {
        id: true,
        nickname: true,
        bio: true,
        avatarUrl: true,
        location: true,
      },
    });

    if (!user) throw fastify.httpErrors.notFound();
    const isOwnAccount = user.id === ownUserId;

    return reply.send({ isOwnAccount, ...user });
  });
};

export default getUser;
