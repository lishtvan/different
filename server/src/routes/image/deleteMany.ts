import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Image'],
  body: {
    type: 'object',
    required: ['imageKeys'],
    properties: {
      imageKeys: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const deleteManyImages: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/deleteMany', { schema }, async (req, reply) => {
    const { imageKeys } = req.body;
    await fastify.s3.deleteImages(imageKeys);

    return reply.send();
  });
};

export default deleteManyImages;
