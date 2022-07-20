import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { FastifyPluginAsync } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Account'],
  description: 'Dont forget to delete old avatar from s3. See route /image/delete',
  body: {
    type: 'object',
    properties: {
      avatar: { $ref: 'file' },
      nickname: {
        type: 'object',
        required: ['value'],
        properties: {
          value: { type: 'string', minLength: 2, maxLength: 30 },
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

const updateAccount: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/update', { schema }, async (req, reply) => {
    const avatar = req.body.avatar as unknown as MultipartFile;
    const { nickname, bio } = req.body;

    try {
      await fastify.prisma.account.update({
        where: {
          id: Number(req.cookies.accountId),
        },
        data: {
          // REFACTOR
          avatarKey: avatar.filename,
          nickname: nickname?.value,
          bio: bio?.value,
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

export default updateAccount;
