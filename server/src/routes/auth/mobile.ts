import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Auth'],
  body: {
    type: 'object',
    required: ['accessToken'],
    properties: {
      accessToken: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const googleAuth: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/google/mobile', { schema }, async (req, reply) => {
    const { id } = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        authorization: 'Bearer' + req.body.accessToken,
      },
    }).then((res) => res.json());

    const { token, userId } = await fastify.session.start(
      { providerId: id },
      req.raw.socket.remoteAddress || ''
    );

    reply.send({ token, userId });
  });
};

export default googleAuth;
