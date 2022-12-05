import { FastifyPluginAsync } from 'fastify';

const rooms = new Map();
const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/message', { websocket: true }, (connection) => {
    const { socket } = connection;
    socket.on('message', (message) => {
      const data = JSON.parse(message.toString());
      console.log({ chatId: data.room });
      let room = rooms.get(data.room);

      if (!room) {
        room = new Set();
        rooms.set(data.room, room);
      }

      if (!room.has(socket)) room.add(socket);
      console.log(rooms);

      for (const client of room) {
        client.send(JSON.stringify(data));
      }
    });
  });
};

export default root;
