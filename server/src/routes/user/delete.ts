import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['User'],
};

const updateUser: FastifyPluginAsync = async (fastify) => {
  fastify.post('/delete', { schema }, async (req, reply) => {
    const { userId: reqUserId } = req;

    await fastify.prisma.user.delete({ where: { id: reqUserId } });
    await fastify.prisma.chat.deleteMany({
      where: { Users: { some: { id: reqUserId } } },
    });

    await fastify.search.deleteMany(`sellerId:=${reqUserId} && status:=AVAILABLE`);
    // TODO: test this
    return reply.send({});
  });
};

export default updateUser;
