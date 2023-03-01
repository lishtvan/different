import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Auth'],
};

const authCheck: FastifyPluginAsync = async (fastify) => {
  fastify.get('/check', { schema }, async (req, res) => {
    const ownUserId = Number(req.cookies.userId);

    const user = await fastify.prisma.user.findUnique({
      where: { id: ownUserId },
      select: {
        id: true,
        nickname: true,
        avatarUrl: true,
        Chats: {
          where: {
            notification: true,
            Users: {
              some: {
                id: ownUserId,
              },
            },
          },
          select: {
            Messages: {
              select: { senderId: true },
              take: -1,
            },
          },
        },
      },
    });

    // TODO: check case with zero chats
    const chatsWithNotification = user?.Chats.filter(
      (chat) => chat.Messages[0].senderId !== ownUserId
    );

    res.send({ ...user, chatNoficicationCount: chatsWithNotification?.length });
  });
};

export default authCheck;
