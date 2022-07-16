import fp from 'fastify-plugin';
import hyperid = require('hyperid');

export default fp(async (fastify) => {
  fastify.decorate('id', hyperid({ urlSafe: true }));
});

declare module 'fastify' {
  interface FastifyInstance {
    id: () => string;
  }
}
