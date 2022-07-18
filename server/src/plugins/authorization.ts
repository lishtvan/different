import fp from 'fastify-plugin';
import { COOKIE_OPTIONS } from '../constants/auth';

export default fp(async (fastify) => {
  const publicRoutes = ['/auth/google', '/auth/google/callback'];

  fastify.addHook('preHandler', async (req, reply) => {
    const { routerPath, cookies } = req;
    const { token, accountId } = cookies;

    const isPublicRoute = publicRoutes.includes(routerPath);
    if (isPublicRoute) return;

    if (!token || !accountId) throw fastify.httpErrors.unauthorized();

    // test account
    const session = await fastify.prisma.session.findFirst({
      where: { token, accountId: Number(accountId) },
    });

    if (!session) throw fastify.httpErrors.unauthorized();

    reply
      .setCookie('token', session.token, COOKIE_OPTIONS)
      .setCookie('accountId', session.accountId.toString(), COOKIE_OPTIONS);
  });
});
