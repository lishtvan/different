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
    const { nickname, userId } = req.body;
    const ownUserId = Number(req.cookies.userId);
    const whereUserInput = userId ? { id: userId } : { nickname };

    let isOwnAccount;
    if (!ownUserId) {
      isOwnAccount = false;
    } else if (userId) {
      isOwnAccount = userId === ownUserId;
    } else {
      const ownUser = await fastify.prisma.user.findUnique({
        where: { id: ownUserId },
      });
      isOwnAccount = ownUser?.nickname === nickname;
    }

    const user = await fastify.prisma.user.findUnique({
      where: whereUserInput,
      select: {
        id: true,
        nickname: true,
        bio: true,
        avatarUrl: true,
        location: true,
        Chats: isOwnAccount && {
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            notification: true,
            Users: {
              select: { nickname: true, avatarUrl: true },
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
