import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';

export default fp(async (fastify) => {
  fastify.register(swagger, {
    routePrefix: '/swagger',
    swagger: {
      info: {
        title: 'Different backend API',
        version: '1.0.0',
      },
      host: 'localhost:8000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
    uiConfig: {
      docExpansion: 'none',
      deepLinking: false,
    },
    staticCSP: true,
    exposeRoute: true,
  });
});
