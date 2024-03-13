import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';

export default fp(async (fastify) => {
  if (process.env.NODE_ENV === 'production') return;
  fastify.register(fastifySwagger, {
    mode: 'dynamic',
    openapi: {
      info: {
        title: 'Different API',
        version: '1.0.0',
      },
    },
  });
});
