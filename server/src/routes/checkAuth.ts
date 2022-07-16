import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/checkAuthorization', async (req, res) => res.send());
};

export default root;
