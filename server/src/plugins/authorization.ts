import fp from 'fastify-plugin';
import { COOKIE_OPTIONS } from '../constants/auth';

export default fp(async (fastify) => {
  const publicRoutes = [
    '/auth/google',
    '/auth/facebook',
    '/auth/twitter',
    '/auth/google/callback',
    '/auth/facebook/callback',
    '/auth/twitter/callback',
    '/user/get',
    '/listing/get',
    '/images/getAll/:s3DeleteKey',
    '/bill/webhook/:MNBNK_WEBHOOK_KEY',
  ];

  fastify.addHook('preHandler', async (req, reply) => {
    const { routerPath, cookies } = req;
    const { token, userId } = cookies;

    const isPublicRoute = publicRoutes.includes(routerPath);
    if (isPublicRoute) return;

    if (!token || !userId) throw fastify.httpErrors.unauthorized();
    const session = await fastify.prisma.session.findFirst({
      where: { token, userId: Number(userId) },
      select: { token: true, userId: true, User: { select: { isBill: true } } },
    });
    if (!session) throw fastify.httpErrors.unauthorized();

    reply
      .setCookie('token', session.token, COOKIE_OPTIONS)
      .setCookie('userId', session.userId.toString(), COOKIE_OPTIONS);

    if (session.User.isBill) {
      reply.header('bill', 'pay');
      if (routerPath === '/auth/logout') return reply.send();
    }
  });
});
