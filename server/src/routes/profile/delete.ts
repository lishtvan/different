import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Profile'],
};

const deleteProfile: FastifyPluginAsync = async (fastify) => {
  fastify.post('/delete', { schema }, async (req, reply) => {
    const session = await fastify.prisma.session.findFirst({
      where: {
        token: req.cookies.token,
      },
      select: {
        accountId: true,
      },
    });

    const { avatarKey } = await fastify.prisma.profile.delete({
      where: {
        accountId: session?.accountId,
      },
      select: {
        avatarKey: true,
      },
    });

    if (avatarKey) await fastify.s3.deleteImage(avatarKey);

    return reply.send();
  });
};

export default deleteProfile;
