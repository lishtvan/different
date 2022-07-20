import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Account'],
  body: {
    type: 'object',
    properties: {
      cursor: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    },
  } as const,
  response: {
    '2xx': {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string' },
          nickname: { type: 'string' },
          accountId: { type: 'number' },
          avatarKey: { type: 'string', nullable: true },
          bio: { type: 'string', nullable: true },
          socials: { type: 'string', nullable: true },
        },
      },
    },
  },
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getAllAccounts: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/getAll', { schema }, async (req, reply) => {
    const { cursor } = req.body;

    const accounts = await fastify.prisma.account.findMany({
      take: 12,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });

    return reply.send(accounts);
  });
};

export default getAllAccounts;
