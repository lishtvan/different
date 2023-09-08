import fp from 'fastify-plugin';

export interface Session {
  start: (
    userInfo: { providerId: string },
    ip: string
  ) => Promise<{ token: string; userId: string }>;
  destroy: (token: string) => Promise<void>;
}

export default fp(async (fastify) => {
  const { TOKEN_SECRET, TOKEN_CHARACTERS } = process.env;

  fastify.decorate<Session>('session', {
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
            Sessions: {
              create: { token, ip },
            },
          },
        });
        await fastify.prisma.user.update({
          where: { id: createdUser.id },
          data: { nickname: `different_user_${createdUser.id}` },
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
    session: Session;
  }
}
