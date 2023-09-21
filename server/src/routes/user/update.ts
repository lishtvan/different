import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['User'],
  body: {
    type: 'object',
    properties: {
      avatarUrl: { type: 'string' },
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
          maxLength: 'Bio length must not be longer than 150 characters ',
        },
      },
      location: {
        type: 'string',
        maxLength: 40,
        errorMessage: {
          maxLength: 'Location length must not be longer than 40 characters ',
        },
      },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const updateUser: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/update', { schema }, async (req, reply) => {
    const { nickname, bio, avatarUrl, location } = req.body;
    const { userId } = req;

    try {
      await fastify.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          nickname,
          avatarUrl,
          bio,
          location,
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
