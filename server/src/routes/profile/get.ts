import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Profile'],
  body: {
    type: 'object',
    required: ['accountId'],
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

const getProfile: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/get', { schema }, async (req, reply) => {
    const { accountId } = req.body;

    const profile = await fastify.prisma.profile.findFirst({
      where: { accountId },
      select: {
        socials: true,
        nickname: true,
        bio: true,
        avatarKey: true,
      },
    });

    return reply.send(profile);
  });
};

export default getProfile;
