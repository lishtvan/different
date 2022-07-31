import fp from 'fastify-plugin';
import { SessionPlugin } from '../types/session';

export default fp(async (fastify) => {
  const { TOKEN_SECRET, TOKEN_CHARACTERS } = process.env;

  fastify.decorate<SessionPlugin>('session', {
    start: async (userInfo, ip) => {
      const token = fastify.generateToken(TOKEN_SECRET, TOKEN_CHARACTERS);

      const user = await fastify.prisma.user.findUnique({
        where: { providerId: userInfo.providerId },
      });

      let userId;

      if (user) {
        await fastify.prisma.session.create({
          data: { token, ip, userId: user.id },
        });
        userId = user.id;
      } else {
        const createdUser = await fastify.prisma.user.create({
          data: {
            providerId: userInfo.providerId,
            name: userInfo.name || 'Different User',
            Sessions: {
              create: { token, ip },
            },
          },
        });
        userId = createdUser.id;
      }

      return {
        token,
        userId: userId.toString(),
      };
    },
    destroy: async (token) => {
      await fastify.prisma.session.delete({
        where: { token },
      });
    },
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    session: SessionPlugin;
  }
}
