import { FastifyPluginAsync } from 'fastify';
import { WebSocket } from 'ws';

const chats = new Map<string, Set<WebSocket>>();
const notificationTimeouts = new Map(); // Track timeouts for notifications

const clearNotificationTimeout = (chatId: string, receiverId: number) => {
  const timeout = notificationTimeouts.get(chatId);
  if (timeout && timeout.receiverId === receiverId) {
    clearTimeout(timeout.timeoutId);
    notificationTimeouts.delete(chatId);
  }
};

const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/message', { websocket: true }, (socket, req) => {
    const reqUserId = req.userId;

    fastify.websocketServer.on('connection', async () => {
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
    });

    socket.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.messageSeen) {
          await fastify.prisma.chatNotification.deleteMany({
            where: { chatId: data.chatId, userId: reqUserId },
          });
          clearNotificationTimeout(data.chatId, reqUserId);
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
              _count: {
                select: {
                  ChatNotification: { where: { userId: reqUserId } },
                },
              },
              Messages: { orderBy: { createdAt: 'desc' } },
              Users: { select: { id: true, nickname: true, avatarUrl: true } },
            },
          });
          if (!chat) return;
          clearNotificationTimeout(data.chatId, reqUserId);

          const u = chat.Users;
          const isFirstUserSender = u[0].id === reqUserId;
          const [recipient, sender] = isFirstUserSender ? [u[1], u[0]] : [u[0], u[1]];

          if (chat._count.ChatNotification) {
            await fastify.prisma.chatNotification.deleteMany({
              where: { chatId: data.chatId, userId: reqUserId },
            });
          }

          socket.send(
            JSON.stringify({ chat: { ...chat, Users: { recipient, sender } } })
          );
          return;
        }

        if (data.text) {
          const [newMessage] = await Promise.all([
            fastify.prisma.message.create({
              data: {
                chatId: data.chatId,
                text: data.text,
                relatedListingId: data.relatedListingId,
                relatedListingTitle: data.relatedListingTitle,
                senderId: reqUserId,
              },
            }),
            fastify.prisma.chatNotification.create({
              data: { chatId: data.chatId, userId: data.receiverId },
            }),
          ]);

          const timeoutId = setTimeout(() => {
            fastify.notifications.sendChatNotification({
              recipientId: data.receiverId,
              text: data.text,
              senderId: reqUserId,
              chatId: data.chatId,
            });
            notificationTimeouts.delete(data.chatId);
          }, 5000);
          notificationTimeouts.set(data.chatId, {
            timeoutId,
            receiverId: data.receiverId,
          });

          for (const client of currentChat) {
            client.send(JSON.stringify(newMessage));
          }
        }
        return;
      } catch (e) {
        fastify.log.error(e);
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
