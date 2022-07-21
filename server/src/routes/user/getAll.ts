import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['User'],
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
          userId: { type: 'number' },
          avatarKey: { type: 'string', nullable: true },
          bio: { type: 'string', nullable: true },
          socials: { type: 'string', nullable: true },
        },
      },
    },
  },
};

type Schema = { Body: FromSchema<typeof schema.body> };
// to one endpoint
const getAllUsers: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/getAll', { schema }, async (req, reply) => {
    const { cursor } = req.body;

    const users = await fastify.prisma.user.findMany({
      take: 12,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });

    return reply.send(users);
  });
};

export default getAllUsers;
