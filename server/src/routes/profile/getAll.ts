import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Profile'],
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

const getAllProfiles: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/getAll', { schema }, async (req, reply) => {
    const { cursor } = req.body;

    const profiles = await fastify.prisma.profile.findMany({
      take: 12,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });

    return reply.send(profiles);
  });
};

export default getAllProfiles;
