import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['User'],
};

const deleteUser: FastifyPluginAsync = async (fastify) => {
  fastify.post('/delete', { schema }, async (req, reply) => {
    const { userId } = req;

    await fastify.prisma.user.delete({
      where: { id: userId },
    });

    return reply.send();
  });
};

export default deleteUser;
