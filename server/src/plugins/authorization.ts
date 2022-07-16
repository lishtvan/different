import fp from 'fastify-plugin';
import { COOKIE_OPTIONS } from '../constants/auth';

export default fp(async (fastify) => {
  const publicRoutes = ['/auth/google', '/auth/google/callback'];

  fastify.addHook('preHandler', async (req, reply) => {
    const { routerPath, cookies } = req;
    const { token } = cookies;

    const isPublicRoute = publicRoutes.includes(routerPath);
    if (isPublicRoute) return;

    if (!token) throw fastify.httpErrors.unauthorized();

    const session = await fastify.prisma.session.findUnique({ where: { token } });
    if (!session) throw fastify.httpErrors.unauthorized();

    reply
      .setCookie('token', session.token, COOKIE_OPTIONS)
      .setCookie('accountId', session.accountId.toString(), COOKIE_OPTIONS);
  });
});
