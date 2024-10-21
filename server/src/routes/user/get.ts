import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['User'],
  body: {
    type: 'object',
    properties: {
      nickname: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getUser: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { nickname } = req.body;
    const { userId: ownUserId } = req;
    const [user, availableListingsCount, soldListingsCount] = await Promise.all([
      fastify.prisma.user.findUnique({
        where: {
          nickname,
          BlockedUsers: { none: { blockedId: ownUserId } },
          BlockedBy: { none: { blockerId: ownUserId } },
        },
        select: {
          id: true,
          nickname: true,
          bio: true,
          avatarUrl: true,
          location: true,
        },
      }),
      fastify.prisma.listing.count({
        where: { status: 'AVAILABLE', User: { nickname } },
      }),
      fastify.prisma.listing.count({
        where: { status: 'SOLD', User: { nickname } },
      }),
    ]);
    if (!user) throw fastify.httpErrors.notFound();
    const isOwnAccount = user.id === ownUserId;

    return reply.send({
      ...user,
      isOwnAccount,
      ownUserId,
      availableListingsCount,
      soldListingsCount,
    });
  });
};

export default getUser;
