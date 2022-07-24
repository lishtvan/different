import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/check', async (req, res) => {
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

export default root;
