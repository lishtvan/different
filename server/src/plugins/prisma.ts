import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  fastify.log.info(`Successfully connected to db in ${process.env.NODE_ENV} environment`);
  fastify.decorate('prisma', prisma);
  fastify.addHook('onClose', async (server) => {
    await server.prisma.$disconnect();
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
