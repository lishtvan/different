import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import jwt, { JwtHeader } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

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

const appleAuth: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/apple', { schema }, async (req, reply) => {
    const accessToken = req.body.accessToken;
    const url = 'https://appleid.apple.com/auth/keys';
    const response = await fetch(url);
    const { keys } = await response.json();
    const jwtHeader = jwt.decode(accessToken, { complete: true })?.header;
    if (!jwtHeader) throw fastify.httpErrors.internalServerError();
    const appleKey = keys.find((key: JwtHeader) => key.kid === jwtHeader.kid);
    const pem = jwkToPem(appleKey);

    const appleUserInfo = jwt.verify(accessToken, pem, {
      algorithms: ['RS256'],
    }) as { sub: string; email: string };
    const { token } = await fastify.session.start(
      { providerId: appleUserInfo.sub, email: appleUserInfo.email },
      req.raw.socket.remoteAddress || ''
    );

    return reply.send({ token });
  });
};

export default appleAuth;
