import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

export default fp(async (fastify) => {
  await fastify.register(rateLimit, {
    max: 200,
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
      preHandler: fastify.rateLimit({ max: 100, ban: 2, timeWindow: '1 minute' }),
    },
    (req, reply) => {
      reply.send();
    }
  );
});
