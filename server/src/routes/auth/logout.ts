import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Auth'],
};

const logout: FastifyPluginAsync = async (fastify) => {
  fastify.post('/logout', { schema }, async (req, reply) => {
    const { token } = req.cookies;
    if (token) await fastify.session.destroy(token);

    return reply.send();
  });
};

export default logout;
