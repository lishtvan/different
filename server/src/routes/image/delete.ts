import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Image'],
  body: {
    type: 'object',
    required: ['imageKey'],
    properties: {
      imageKey: {
        type: 'string',
      },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const deleteImage: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/delete', { schema }, async (req, reply) => {
    const { imageKey } = req.body;
    await fastify.s3.deleteImage(imageKey);

    return reply.send();
  });
};

export default deleteImage;
