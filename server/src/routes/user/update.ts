import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['User'],
  body: {
    type: 'object',
    properties: {
      avatarKey: { type: 'string' },
      nickname: {
        type: 'string',
        minLength: 2,
        maxLength: 20,
        errorMessage: {
          minLength: 'Nickname length must not be shorter than 2 characters ',
          maxLength: 'Nickname length must not be longer than 20 characters ',
        },
      },
      bio: {
        type: 'string',
        maxLength: 150,
        errorMessage: {
          maxLength: 'Nickname length must not be longer than 150 characters ',
        },
      },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const updateUser: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/update', { schema }, async (req, reply) => {
    const { nickname, bio, avatarKey } = req.body;
    try {
      await fastify.prisma.user.update({
        where: {
          id: Number(req.cookies.userId),
        },
        data: {
          nickname,
          avatarKey,
          bio,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw fastify.httpErrors.badRequest(
          'body/nickname User with such nickname already exists'
        );
      }
      throw e;
    }

    return reply.send();
  });
};

export default updateUser;
