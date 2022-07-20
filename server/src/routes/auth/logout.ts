import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Auth'],
};

const logout: FastifyPluginAsync = async (fastify) => {
  fastify.post('/logout', { schema }, async (req, reply) => {
    await fastify.session.destroy(req.cookies.token!);

    return reply.send();
  });
};

export default logout;
