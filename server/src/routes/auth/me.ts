import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Auth'],
};

const authCheck: FastifyPluginAsync = async (fastify) => {
  fastify.get('/me', { schema }, async (req, res) => {
    const { userId } = req;

    const user = await fastify.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        phone: true,
        cardNumber: true,
        avatarUrl: true,
        location: true,
        bio: true,
        npCityRef: true,
        npCityName: true,
        npDepartmentRef: true,
        npDepartmentName: true,
        firstName: true,
        lastName: true,
        Chats: {
          where: {
            notification: true,
            Users: { some: { id: userId } },
            Messages: { some: {} },
          },
          select: { Messages: { select: { senderId: true }, take: -1 } },
        },
      },
    });

    const chatsWithNotification = user?.Chats.filter(
      (chat) => chat.Messages[0].senderId !== userId
    );
    fastify.np.trackInternetDocuments(userId);

    res.send({ ...user, chatNoficicationCount: chatsWithNotification?.length });
  });
};

export default authCheck;
