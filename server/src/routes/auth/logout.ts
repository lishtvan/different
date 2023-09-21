import { FastifyPluginAsync } from 'fastify';
import { COOKIE_OPTIONS } from '../../constants/auth';

const schema = {
  tags: ['Auth'],
};

const logout: FastifyPluginAsync = async (fastify) => {
  fastify.post('/logout', { schema }, async (req, reply) => {
    await fastify.session.destroy(req.cookies.token!);
    return reply.clearCookie('token', COOKIE_OPTIONS).send();
  });
};

export default logout;
