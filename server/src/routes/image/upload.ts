import { FastifyPluginAsync } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Image'],
  body: {
    type: 'object',
    required: ['image'],
    properties: {
      image: { $ref: 'file' },
    },
  } as const,
  response: {
    '2xx': {
      type: 'object',
      properties: {
        imageKey: { type: 'string' },
      },
    },
  },
};

type Schema = { Body: FromSchema<typeof schema.body> };

const uploadImage: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/upload', { schema }, async (req, reply) => {
    const { image } = req.body as { image: MultipartFile };

    const location = await fastify.s3.upload(image);
    const imageKey = location.split('/').pop();
    return reply.send({ imageKey });
  });
};

export default uploadImage;
