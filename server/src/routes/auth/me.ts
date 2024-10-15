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
        _count: {
          select: {
            OrderNotification: true,
            ChatNotification: true,
          },
        },
        BlockedUsers: {
          select: {
            blockedId: true,
          },
        },
      },
    });

    res.send(user);
  });
};

export default authCheck;
