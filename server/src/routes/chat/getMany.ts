import { FastifyPluginAsync } from 'fastify';

const getChatsByUserId: FastifyPluginAsync = async (fastify) => {
  fastify.post('/getMany', async (req, reply) => {
    const { userId } = req;

    const chats = await fastify.prisma.chat.findMany({
      where: { Users: { some: { id: userId } } },
      select: {
        _count: { select: { ChatNotification: { where: { userId } } } },
        id: true,
        Users: {
          select: {
            nickname: true,
            avatarUrl: true,
            BlockedBy: true,
            BlockedUsers: true,
          },
          where: { id: { not: userId } },
        },
        Messages: {
          select: { text: true, senderId: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const filteredByBlock = chats.filter((i) => {
      let remove = true;

      i.Users[0].BlockedBy.forEach((i) => {
        remove = i.blockerId !== userId;
      });

      i.Users[0].BlockedUsers.forEach((i) => {
        remove = i.blockedId !== userId;
      });

      return remove;
    });

    const sortedChats = filteredByBlock.sort((a, b) => {
      const lastMessageA = a.Messages[0];
      const lastMessageB = b.Messages[0];

      if (!lastMessageA) return 1;
      if (!lastMessageB) return -1;

      return (
        new Date(lastMessageB.createdAt).getTime() -
        new Date(lastMessageA.createdAt).getTime()
      );
    });

    return reply.send({ chats: sortedChats });
  });
};

export default getChatsByUserId;
