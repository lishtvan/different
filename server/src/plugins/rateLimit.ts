import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

export default fp(async (fastify) => {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    ban: 2,
    allowList: [], // add monobank
  });
  fastify.setNotFoundHandler(
    {
      preValidation: (req, reply, done) => {
        reply.status(404);
        done();
      },
      preHandler: fastify.rateLimit({ max: 50, ban: 2 }),
    },
    (req, reply) => {
      reply.send();
    }
  );
});
