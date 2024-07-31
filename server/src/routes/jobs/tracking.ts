import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Jobs'],
};

const getOrder: FastifyPluginAsync = async (fastify) => {
  fastify.post('/tracking', { schema }, async (req, reply) => {
    return reply.send();
  });
};

export default getOrder;
