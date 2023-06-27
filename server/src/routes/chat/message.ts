import { FastifyPluginAsync } from 'fastify';
import { WebSocket } from 'ws';

const chats = new Map<string, Set<WebSocket>>();

const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/message', { websocket: true }, (connection, req) => {
    const { socket } = connection;
    socket.on('message', async (message: object) => {
      const data = JSON.parse(message.toString());
      const ownUserId = Number(req.cookies.userId);

      let chat = chats.get(data.chatId);
      if (!chat) {
        chat = new Set();
        chats.set(data.chatId, chat);
      }
      if (!chat.has(socket)) chat.add(socket);

      if (data.messageSeen) {
        await fastify.prisma.chat.update({
          where: { id: data.chatId },
          data: { notification: false },
        });
        socket.send(JSON.stringify({}));
        return;
      }

      if (data.isConnect) {
        const chat = await fastify.prisma.chat.findFirst({
          where: { id: data.chatId, Users: { some: { id: ownUserId } } },
          select: {
            notification: true,
            Messages: { orderBy: { createdAt: 'desc' } },
            Users: { select: { id: true, nickname: true, avatarUrl: true } },
          },
        });
        if (!chat) return;

        const recipient = chat?.Users.find((user) => user.id !== ownUserId);
        const sender = chat?.Users.find((user) => user.id === ownUserId);
        if (chat.notification && chat.Messages[0].senderId === recipient?.id) {
          await fastify.prisma.chat.update({
            where: { id: data.chatId },
            data: { notification: false },
          });
        }

        socket.send(JSON.stringify({ chat: { ...chat, Users: { recipient, sender } } }));
        return;
      }

      const { Messages } = await fastify.prisma.chat.update({
        where: { id: data.chatId },
        select: {
          Messages: {
            take: -1,
          },
        },
        data: {
          notification: true,
          Messages: {
            create: {
              text: data.text,
              senderId: ownUserId,
            },
          },
        },
      });

      const newMessage = Messages[0];

      for (const client of chat) {
        client.send(JSON.stringify(newMessage));
      }
    });

    socket.on('close', () => {
      chats.forEach((chat) => {
        if (chat.has(socket)) chat.delete(socket);
      });
    });
  });
};

export default root;
