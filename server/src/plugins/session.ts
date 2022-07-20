import fp from 'fastify-plugin';
import { SessionPlugin } from '../types/session';

export default fp(async (fastify) => {
  const { TOKEN_SECRET, TOKEN_CHARACTERS } = process.env;

  fastify.decorate<SessionPlugin>('session', {
    start: async (userInfo, ip) => {
      const token = fastify.generateToken(TOKEN_SECRET, TOKEN_CHARACTERS);

      const account = await fastify.prisma.account.findUnique({
        where: { email: userInfo.email },
      });

      let accountId;

      if (account) {
        await fastify.prisma.session.create({
          data: { token, ip, accountId: account.id },
        });
        accountId = account.id;
      } else {
        const createdAccount = await fastify.prisma.account.create({
          data: {
            email: userInfo.email,
            name: userInfo.name,
            Sessions: {
              create: { token, ip },
            },
          },
        });
        accountId = createdAccount.id;
      }

      return {
        token,
        accountId: accountId.toString(),
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
