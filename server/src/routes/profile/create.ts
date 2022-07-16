import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { FastifyPluginAsync } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Profile'],
  body: {
    type: 'object',
    required: ['nickname'],
    properties: {
      avatar: { $ref: 'file' },
      nickname: {
        type: 'object',
        required: ['value'],
        properties: {
          value: { type: 'string', minLength: 2, maxLength: 30 },
        },
      },
      socials: {
        type: 'object',
        properties: {
          value: { type: 'string', maxLength: 50 },
        },
      },
      bio: {
        type: 'object',
        properties: {
          value: { type: 'string', maxLength: 300 },
        },
      },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const createProfile: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/create', { schema }, async (req, reply) => {
    const avatar = req.body.avatar as unknown as MultipartFile;
    const { nickname, bio, socials } = req.body;

    try {
      await fastify.prisma.session.update({
        where: {
          token: req.cookies.token,
        },
        data: {
          account: {
            update: {
              Profile: {
                create: {
                  // REFACTOR
                  avatarKey: avatar.filename,
                  nickname: nickname.value,
                  bio: bio?.value,
                  socials: socials?.value,
                },
              },
            },
          },
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw fastify.httpErrors.badRequest('User with such nickname already exists');
      }
      throw e;
    }

    if (avatar) await fastify.s3.upload(avatar);

    return reply.send();
  });
};

export default createProfile;
