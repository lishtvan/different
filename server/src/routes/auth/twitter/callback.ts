import { FastifyPluginAsync } from 'fastify';
import { COOKIE_OPTIONS } from '../../../constants/auth';

const schema = {
  tags: ['Auth'],
};

const twitterCallback: FastifyPluginAsync = async (fastify) => {
  fastify.get('/callback', { schema }, async (req, reply) => {
    const { code } = req.query as { code: string };
    await fastify.twitterOauth2.requestAccessToken(code);
    const { data } = await fastify.twitterClient.users.findMyUser();

    if (!data) return reply.send('Something went wrong.');

    const { token, userId } = await fastify.session.start(
      { providerId: data.id },
      req.raw.socket.remoteAddress || ''
    );

    reply
      .setCookie('token', token, COOKIE_OPTIONS)
      .setCookie('userId', userId, COOKIE_OPTIONS)
      .redirect(`${process.env.WEB_DOMAIN}/auth?token=${token}&userId=${userId}`);
  });
};

export default twitterCallback;
