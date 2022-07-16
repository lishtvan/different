import fp from 'fastify-plugin';
import { OAuth2Namespace } from '@fastify/oauth2';
import oauthPlugin from '@fastify/oauth2';

export default fp(async (fastify) => {
  fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: '655518977179-crbcfme4ce1eq3lqp723hk9eha6m7uaa.apps.googleusercontent.com',
        secret: process.env.CLIENT_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/auth/google',
    callbackUri: `${process.env.DOMAIN}/auth/google/callback`,
    callbackUriParams: {
      access_type: 'offline',
    },
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}
