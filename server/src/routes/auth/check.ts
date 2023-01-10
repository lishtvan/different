import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Auth'],
};

const authCheck: FastifyPluginAsync = async (fastify) => {
  fastify.get('/check', { schema }, async (req, res) => {
    const ownUserId = Number(req.cookies.userId);

    const user = await fastify.prisma.user.findUnique({
      where: { id: ownUserId },
      select: { id: true, avatarUrl: true },
    });

    res.send(user);
  });
};

export default authCheck;
