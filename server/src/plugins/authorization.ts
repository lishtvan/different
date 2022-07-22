import fp from 'fastify-plugin';
import { COOKIE_OPTIONS } from '../constants/auth';

export default fp(async (fastify) => {
  const publicRoutes = [
    '/auth/google',
    '/auth/google/callback',
    '/user/get',
    '/image/upload',
  ];

  fastify.addHook('preHandler', async (req, reply) => {
    const { routerPath, cookies } = req;
    const { token, userId } = cookies;

    const isPublicRoute = publicRoutes.includes(routerPath);
    if (isPublicRoute) return;

    if (!token || !userId) throw fastify.httpErrors.unauthorized();
    const session = await fastify.prisma.session.findFirst({
      where: { token, userId: Number(userId) },
    });
    if (!session) throw fastify.httpErrors.unauthorized();

    reply
      .setCookie('token', session.token, COOKIE_OPTIONS)
      .setCookie('userId', session.userId.toString(), COOKIE_OPTIONS);
  });
});
