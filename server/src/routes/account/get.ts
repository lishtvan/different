import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Account'],
  body: {
    type: 'object',
    properties: {
      accountId: { type: 'number' },
    },
  } as const,
  response: {
    '2xx': {
      socials: { type: 'string', nullable: true },
      bio: { type: 'string', nullable: true },
      nickname: { type: 'string' },
      avatarKey: { type: 'string', nullable: true },
    },
  },
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getAccount: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { accountId } = req.body;

    const account = await fastify.prisma.account.findUnique({
      where: { id: Number(accountId || req.cookies.accountId) },
      select: {
        nickname: true,
        bio: true,
        avatarKey: true,
      },
    });

    return reply.send(account);
  });
};

export default getAccount;
