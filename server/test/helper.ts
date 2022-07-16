import Fastify, { FastifyPluginAsync } from 'fastify';

export const buildRoute = (route: FastifyPluginAsync) => {
  const app = Fastify();

  beforeAll(async () => {
    app.register(route);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  return app;
};
