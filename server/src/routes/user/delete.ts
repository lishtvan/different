import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['User'],
};

const deleteUser: FastifyPluginAsync = async (fastify) => {
  fastify.post('/delete', { schema }, async (req, reply) => {
    await fastify.prisma.user.delete({
      where: { id: Number(req.cookies.userId) },
    });

    return reply.send();
  });
};

export default deleteUser;
