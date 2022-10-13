import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Auth'],
};

const twitterRedirect: FastifyPluginAsync = async (fastify) => {
  fastify.get('', { schema }, async (req, reply) => {
    const authUrl = fastify.twitterOauth2.generateAuthURL({
      state: 'my-state',
      code_challenge_method: 's256',
    });
    return reply.redirect(authUrl);
  });
};

export default twitterRedirect;
