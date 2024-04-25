import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  const publicRoutes = [
    '/auth/google/mobile',
    '/auth/apple',
    '/user/get',
    '/listing/get',
    '/images/getAll/:s3DeleteKey',
  ];

  fastify.decorateRequest('userId', 0);

  fastify.addHook('preHandler', async (req, reply) => {
    if (reply.statusCode === 404) return; // In case rate limiter throws 404
    const token = req.cookies.token;

    const isPublicRoute = publicRoutes.includes(req.routeOptions.url!);
    if (isPublicRoute) {
      if (token) {
        const session = await fastify.prisma.session.findUnique({
          where: { token },
          select: { userId: true },
        });
        if (session) req.userId = session.userId;
      }
      return;
    }

    if (!token) throw fastify.httpErrors.unauthorized();
    const session = await fastify.prisma.session.findUnique({
      where: { token },
      select: { token: true, userId: true },
    });
    if (!session) throw fastify.httpErrors.unauthorized();
    req.userId = session.userId;
  });
});

declare module 'fastify' {
  interface FastifyRequest {
    userId: number;
  }
}
