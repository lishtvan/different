import { FastifyPluginAsync } from 'fastify';

const chats = new Map();
const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/message', { websocket: true }, (connection, req) => {
    const { socket } = connection;
    socket.on('message', async (message) => {
      const data = JSON.parse(message.toString());
      const ownUserId = Number(req.cookies.userId);

      let chat = chats.get(data.chatId);
      if (!chat) {
        chat = new Set();
        chats.set(data.chatId, chat);
      }
      if (!chat.has(socket)) chat.add(socket);

      if (data.isConnect) {
        const chat = await fastify.prisma.chat.findUnique({
          where: { id: Number(data.chatId) },
          select: {
            Messages: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            Users: {
              select: {
                id: true,
                nickname: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        });
        const recipient = chat?.Users.find((user) => user.id !== ownUserId);
        const sender = chat?.Users.find((user) => user.id === ownUserId);
        socket.send(JSON.stringify({ chat: { ...chat, Users: { recipient, sender } } }));
        return;
      }

      let newMessage;
      if (data.text) {
        newMessage = await fastify.prisma.message.create({
          data: {
            text: data.text,
            chatId: Number(data.chatId),
            senderId: ownUserId,
          },
        });
      }

      for (const client of chat) {
        client.send(JSON.stringify(newMessage));
      }
    });
  });
};

export default root;
