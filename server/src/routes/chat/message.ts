import { FastifyPluginAsync } from 'fastify';

const chats = new Map();
const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/message', { websocket: true }, (connection) => {
    const { socket } = connection;
    socket.on('message', (message) => {
      const data = JSON.parse(message.toString());

      let chat = chats.get(data.chatId);
      if (!chat) {
        chat = new Set();
        chats.set(data.chatId, chat);
      }
      if (!chat.has(socket)) chat.add(socket);

      for (const client of chat) {
        client.send(JSON.stringify(data));
      }
    });
  });
};

export default root;
