import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (req, res) => {
    return res.send({ env: process.env });
  });
};

export default root;
