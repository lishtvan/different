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
        pushToken: true,
        _count: {
          select: {
            Notifications: true,
          },
        },
      },
    });

    res.send(user);
  });
};

export default authCheck;
