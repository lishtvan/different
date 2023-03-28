import fp from 'fastify-plugin';
import Typesense, { Client } from 'typesense';

export default fp(async (fastify) => {
  const typesense = new Typesense.Client({
    nodes: [
      {
        host: process.env.TYPESENSE_HOST,
        port: process.env.NODE_ENV === 'local' ? 8108 : 443,
        protocol: process.env.NODE_ENV === 'local' ? 'http' : 'https',
      },
    ],
    apiKey: process.env.TYPESENSE_WRITE_API_KEY,
  });
  fastify.decorate('typesense', typesense);
});

declare module 'fastify' {
  interface FastifyInstance {
    typesense: Client;
  }
}
