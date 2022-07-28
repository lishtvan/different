import { FastifyPluginAsync } from 'fastify';
import { COOKIE_OPTIONS } from '../../constants/auth';

const schema = {
  tags: ['Auth'],
};

const facebookAuth: FastifyPluginAsync = async (fastify) => {
  fastify.get('/facebook/callback', { schema }, async (req, reply) => {
    const oauthToken =
      await fastify.facebookOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

    const facebookUserInfo = await fetch(
      `https://graph.facebook.com/v6.0/me?fields=name,email&access_token=${oauthToken.access_token}`,
      {
        method: 'GET',
      }
    ).then((res) => res.json());

    const { token, userId } = await fastify.session.start(
      facebookUserInfo,
      req.raw.socket.remoteAddress || ''
    );
    console.log({ token, userId });

    reply
      .setCookie('token', token, COOKIE_OPTIONS)
      .setCookie('userId', userId, COOKIE_OPTIONS)
      .redirect(`${process.env.WEB_DOMAIN}/auth`);
  });
};

export default facebookAuth;
