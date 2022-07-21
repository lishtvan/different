import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['User'],
};

const deleteUser: FastifyPluginAsync = async (fastify) => {
  fastify.post('/delete', { schema }, async (req, reply) => {
    const { avatarKey } = await fastify.prisma.user.delete({
      where: {
        id: Number(req.cookies.userId),
      },
      select: {
        avatarKey: true,
      },
    });

    if (avatarKey) await fastify.s3.deleteImage(avatarKey);

    return reply.send();
  });
};

export default deleteUser;
