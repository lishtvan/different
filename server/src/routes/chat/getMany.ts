import { FastifyPluginAsync } from 'fastify';

const getChatsByUserId: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getMany', async (req, reply) => {
    const { userId } = req;

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        Chats: {
          where: { Messages: { some: {} } },
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            notification: true,
            Users: {
              select: { nickname: true, avatarUrl: true },
              where: { id: { not: userId } },
            },
            Messages: {
              select: { text: true, senderId: true, createdAt: true },
              take: -1,
            },
          },
        },
      },
    });

    if (!user) throw fastify.httpErrors.unauthorized();
    const formattedChats: typeof user.Chats = [];
    user?.Chats.forEach((c) => {
      if (c.notification) {
        c.notification = c.Messages[0]?.senderId !== userId;
        formattedChats.push(c);
      } else formattedChats.push(c);
    });

    return reply.send({ chats: formattedChats, userId: user?.id });
  });
};

export default getChatsByUserId;
