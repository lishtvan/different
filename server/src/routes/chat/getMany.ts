import { FastifyPluginAsync } from 'fastify';

const getChatsByUserId: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getMany', async (req, reply) => {
    const { userId } = req;

    const chats = await fastify.prisma.chat.findMany({
      where: { Users: { some: { id: userId } } },
      orderBy: { updatedAt: 'desc' },
      select: {
        _count: { select: { Notifications: { where: { userId } } } },
        id: true,
        Users: {
          select: { nickname: true, avatarUrl: true },
          where: { id: { not: userId } },
        },
        Messages: {
          select: { text: true, senderId: true, createdAt: true },
          take: -1,
        },
      },
    });

    return reply.send({ chats });
  });
};

export default getChatsByUserId;
