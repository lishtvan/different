import { FastifyPluginAsync } from 'fastify';

const getChatsByUserId: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getMany', async (req, reply) => {
    const userId = Number(req.cookies.userId);

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        Chats: {
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            notification: true,
            Users: {
              select: { nickname: true, avatarUrl: true },
              where: { id: { not: userId } },
            },
            Messages: { select: { text: true, senderId: true }, take: -1 },
          },
        },
      },
    });

    return reply.send({ chats: user?.Chats, userId: user?.id });
  });
};

export default getChatsByUserId;
