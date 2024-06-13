import { Expo } from 'expo-server-sdk';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.decorate('notifications', {
    isExpoPushToken: Expo.isExpoPushToken,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    notifications: {
      isExpoPushToken: typeof Expo.isExpoPushToken;
    };
  }
}
