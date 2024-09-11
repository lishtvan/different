import fp from 'fastify-plugin';
import crypto from 'crypto';
export interface Session {
  start: (
    userInfo: { providerId: string; email: string },
    ip: string
  ) => Promise<{ token: string }>;
  destroy: (token: string) => Promise<void>;
}

export default fp(async (fastify) => {
  fastify.decorate<Session>('session', {
    start: async (userInfo, ip) => {
      const token = crypto.randomBytes(48).toString('base64url');

      const user = await fastify.prisma.user.findUnique({
        where: { providerId: userInfo.providerId },
      });

      if (user) {
        await fastify.prisma.session.create({ data: { token, ip, userId: user.id } });
      } else {
        const createdUser = await fastify.prisma.user.create({
          data: {
            providerId: userInfo.providerId,
            email: userInfo.email,
            Sessions: { create: { token, ip } },
          },
        });
        await fastify.prisma.user.update({
          where: { id: createdUser.id },
          data: { nickname: `different_user_${createdUser.id}` },
        });
      }

      return { token };
    },
    destroy: async (token) => {
      await fastify.prisma.session.delete({ where: { token } });
    },
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    session: Session;
  }
}
