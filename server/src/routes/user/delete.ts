import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['User'],
};

const deleteUser: FastifyPluginAsync = async (fastify) => {
  fastify.post('/delete', { schema }, async (req, reply) => {
    const { avatarUrl } = await fastify.prisma.user.delete({
      where: {
        id: Number(req.cookies.userId),
      },
      select: {
        avatarUrl: true,
      },
    });

    if (avatarUrl) await fastify.s3.deleteImage(avatarUrl);

    return reply.send();
  });
};

export default deleteUser;
