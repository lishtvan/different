import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Auth'],
};

const authCheck: FastifyPluginAsync = async (fastify) => {
  fastify.get('/check', { schema }, async (req, res) => {
    const user = await fastify.prisma.user.findUnique({
      where: { id: Number(req.cookies.userId) },
      select: {
        id: true,
        avatarKey: true,
      },
    });
    res.send(user);
  });
};

export default authCheck;
