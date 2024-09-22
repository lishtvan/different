import fp from 'fastify-plugin';

const formattingPlugin = {
  normalizeText: (s?: string) => {
    return s ? s.trim().replace(/\n{3,}/g, '\n\n') : s;
  },
};

export default fp(async (fastify) => {
  fastify.decorate('format', formattingPlugin);
});

declare module 'fastify' {
  interface FastifyInstance {
    format: typeof formattingPlugin;
  }
}
