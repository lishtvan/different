import { FastifyPluginAsync } from 'fastify';
import { WebSocket } from 'ws';

const chats = new Map<string, Set<WebSocket>>();

const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/message', { websocket: true }, (socket, req) => {
    socket.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        const reqUserId = req.userId;

        if (data.connect) {
          const chatIds = await fastify.prisma.user
            .findUnique({
              where: { id: reqUserId },
              select: { Chats: { select: { id: true } } },
            })
            .then((res) => res?.Chats.map((c) => c.id));

          if (!chatIds?.length) return;
          for (const chatId of chatIds) {
            let chat = chats.get(chatId);
            if (!chat) {
              chat = new Set();
              chats.set(chatId, chat);
            }
            if (!chat.has(socket)) chat.add(socket);
          }
          return;
        }

        if (data.messageSeen) {
          await fastify.prisma.chat.update({
            where: { id: data.chatId },
            data: { notification: false },
          });
          socket.send(JSON.stringify({}));
          return;
        }

        let currentChat = chats.get(data.chatId);
        if (!currentChat) {
          currentChat = new Set();
          chats.set(data.chatId, currentChat);
        }
        if (!currentChat.has(socket)) currentChat.add(socket);

        if (data.enterChat) {
          const chat = await fastify.prisma.chat.findFirst({
            where: { id: data.chatId, Users: { some: { id: reqUserId } } },
            select: {
              notification: true,
              Messages: { orderBy: { createdAt: 'desc' } },
              Users: { select: { id: true, nickname: true, avatarUrl: true } },
            },
          });
          if (!chat) return;

          const recipient = chat?.Users.find((user) => user.id !== reqUserId);
          const sender = chat?.Users.find((user) => user.id === reqUserId);
          if (chat.notification && chat.Messages[0].senderId === recipient?.id) {
            await fastify.prisma.chat.update({
              where: { id: data.chatId },
              data: { notification: false },
            });
          }

          socket.send(
            JSON.stringify({ chat: { ...chat, Users: { recipient, sender } } })
          );
          return;
        }

        if (data.text) {
          const { Messages } = await fastify.prisma.chat.update({
            where: { id: data.chatId },
            select: { Messages: { take: -1 } },
            data: {
              notification: true,
              Messages: {
                create: {
                  text: data.text,
                  relatedListingId: data.relatedListingId,
                  relatedListingTitle: data.relatedListingTitle,
                  senderId: reqUserId,
                },
              },
            },
          });

          const newMessage = Messages[0];

          for (const client of currentChat) {
            client.send(JSON.stringify(newMessage));
          }
        }
        return;
      } catch {
        return;
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
