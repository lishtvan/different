import fp from 'fastify-plugin';
import { COOKIE_OPTIONS } from '../constants/auth';

export default fp(async (fastify) => {
  const publicRoutes = [
    '/auth/google',
    '/auth/google/callback',
    '/auth/google/mobile',
    '/user/get',
    '/listing/get',
    '/images/getAll/:s3DeleteKey',
    '/bill/webhook/:MNBNK_WEBHOOK_KEY',
  ];

  fastify.decorateRequest('userId', 0);

  fastify.addHook('preHandler', async (req, reply) => {
    if (reply.statusCode === 404) return;
    const { routeOptions, cookies } = req;
    const { token } = cookies;

    const isPublicRoute = publicRoutes.includes(routeOptions.url);
    if (isPublicRoute) {
      if (token) {
        const session = await fastify.prisma.session.findFirst({
          where: { token },
          select: { userId: true },
        });
        if (session) req.userId = session?.userId;
      }
      return;
    }

    if (!token) throw fastify.httpErrors.unauthorized();
    const session = await fastify.prisma.session.findFirst({
      where: { token },
      select: { token: true, userId: true, User: { select: { isBill: true } } },
    });
    if (!session) throw fastify.httpErrors.unauthorized();
    req.userId = session.userId;
    reply.setCookie('token', session.token, COOKIE_OPTIONS);

    if (session.User.isBill) {
      reply.header('bill', 'pay');
      if (routeOptions.url === '/auth/logout') return reply.send();
    }
  });
});

declare module 'fastify' {
  interface FastifyRequest {
    userId: number;
  }
}
