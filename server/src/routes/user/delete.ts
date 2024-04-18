import { FastifyPluginAsync } from 'fastify';

const schema = {
  tags: ['User'],
};

const updateUser: FastifyPluginAsync = async (fastify) => {
  fastify.post('/delete', { schema }, async (req, reply) => {
    const reqUserId = req.userId;

    const chatIdsToDelete = await fastify.prisma.user
      .findUnique({
        where: { id: reqUserId },
        select: { Chats: { select: { id: true } } },
      })
      .then((res) => res?.Chats.map((c) => c.id));

    await fastify.prisma.$transaction(async (tx) => {
      const deletedUser = await tx.user
        .delete({
          select: { Listings: { where: { status: 'AVAILABLE' } } },
          where: {
            id: reqUserId,
            buyOrders: {
              every: { OR: [{ status: 'FINISHED' }, { status: 'CANCELED' }] },
            },
            sellOrders: {
              every: { OR: [{ status: 'FINISHED' }, { status: 'CANCELED' }] },
            },
          },
        })
        .catch(() => {
          throw fastify.httpErrors.badRequest(
            JSON.stringify({
              message: 'Ви не можете видалити аккаунт поки у вас є активні замовлення',
            })
          );
        });

      if (chatIdsToDelete?.length) {
        await tx.chat.deleteMany({ where: { id: { in: chatIdsToDelete } } });
      }

      // TODO: test this
      if (deletedUser.Listings.length) {
        await fastify.search.deleteMany(`sellerId:=${reqUserId} && status:=AVAILABLE`);
      }
    });

    return reply.send({});
  });
};

export default updateUser;
