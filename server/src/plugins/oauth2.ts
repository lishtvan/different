import fp from 'fastify-plugin';
import { OAuth2Namespace } from '@fastify/oauth2';
import oauthPlugin from '@fastify/oauth2';

export default fp(async (fastify) => {
  fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: '24434242390-at6nud9oiaot847k7k1s7i7t35shngcj.apps.googleusercontent.com',
        secret: process.env.GOOGLE_CLIENT_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/auth/google',
    callbackUri: `${process.env.DOMAIN}/auth/google/callback`,
    callbackUriParams: {
      access_type: 'offline',
    },
  });

  fastify.register(oauthPlugin, {
    name: 'facebookOAuth2',
    scope: ['public_profile', 'email'],
    credentials: {
      client: {
        id: '753860805859407',
        secret: process.env.FACEBOOK_CLIENT_SECRET,
      },
      auth: oauthPlugin.FACEBOOK_CONFIGURATION,
    },
    startRedirectPath: '/auth/facebook',
    callbackUri: `${process.env.DOMAIN}/auth/facebook/callback`,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
    facebookOAuth2: OAuth2Namespace;
  }
}
