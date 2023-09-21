import { FastifyPluginAsync } from 'fastify';
import { COOKIE_OPTIONS } from '../../constants/auth';

const schema = {
  tags: ['Auth'],
};

const googleAuth: FastifyPluginAsync = async (fastify) => {
  fastify.get('/google/callback', { schema }, async (req, reply) => {
    const oauthToken =
      await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

    const { id } = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        authorization: 'Bearer' + oauthToken.token.access_token,
      },
    }).then((res) => res.json());

    const { token } = await fastify.session.start(
      { providerId: id },
      req.raw.socket.remoteAddress || ''
    );

    reply
      .setCookie('token', token, COOKIE_OPTIONS)
      .redirect(`${process.env.WEB_DOMAIN}/auth?token=${token}`);
  });
};

export default googleAuth;
