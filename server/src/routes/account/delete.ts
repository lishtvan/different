import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['Account'],
};

const deleteAccount: FastifyPluginAsync = async (fastify) => {
  fastify.post('/delete', { schema }, async (req, reply) => {
    const { avatarKey } = await fastify.prisma.account.delete({
      where: {
        id: Number(req.cookies.accountId),
      },
      select: {
        avatarKey: true,
      },
    });

    if (avatarKey) await fastify.s3.deleteImage(avatarKey);

    return reply.send();
  });
};

export default deleteAccount;
