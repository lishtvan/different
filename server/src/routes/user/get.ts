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
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getUser: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { userId } = req.body;
    const ownUserId = Number(req.cookies.userId);
    const isOwnAccount = userId === ownUserId;

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
      select: {
        nickname: true,
        bio: true,
        avatarUrl: true,
        name: true,
        location: true,
        Chats: isOwnAccount && {
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            notification: true,
            Users: {
              select: { name: true, nickname: true, avatarUrl: true },
              where: { id: { not: ownUserId } },
            },
            Messages: { select: { text: true, senderId: true }, take: -1 },
          },
        },
      },
    });

    if (!user) throw fastify.httpErrors.notFound();

    return reply.send({ isOwnAccount, ...user });
  });
};

export default getUser;
