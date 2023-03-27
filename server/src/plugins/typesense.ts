import fp from 'fastify-plugin';
import Typesense from 'typesense';

export default fp(async (fastify) => {
  const typesense = new Typesense.Client({
    nodes: [
      {
        // host: process.env.TYPESENSE_HOST!!,
        host: 'host',
        port: process.env.NODE_ENV === 'local' ? 8108 : 443,
        protocol: process.env.NODE_ENV === 'local' ? 'http' : 'https',
      },
    ],
    apiKey: 'xyz',
    // apiKey: process.env.TYPESENSE_WRITE_API_KEY,
  });
  fastify.decorate('typesense', typesense);
});
