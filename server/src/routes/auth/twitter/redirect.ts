import { FastifyPluginAsync } from 'fastify';

const twitterRedirect: FastifyPluginAsync = async (fastify) => {
  fastify.get('', async (req, reply) => {
    const authUrl = fastify.twitterOauth2.generateAuthURL({
      state: 'my-state',
      code_challenge_method: 's256',
    });
    return reply.redirect(authUrl);
  });
};

export default twitterRedirect;
