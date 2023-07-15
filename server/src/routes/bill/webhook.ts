import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Bill'],
  params: {
    type: 'object',
    required: ['MNBNK_WEBHOOK_KEY'],
    properties: {
      MNBNK_WEBHOOK_KEY: { type: 'string' },
    },
  } as const,
  body: {
    type: 'object',
    required: ['status', 'reference'],
    properties: {
      status: { type: 'string' },
      reference: { type: 'string' },
    },
  } as const,
};

type Schema = {
  Params: FromSchema<typeof schema.params>;
  Body: FromSchema<typeof schema.body>;
};

const getBill: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/webhook/:MNBNK_WEBHOOK_KEY', { schema }, async (req, reply) => {
    const { reference, status } = req.body;
    const { MNBNK_WEBHOOK_KEY } = req.params;
    if (MNBNK_WEBHOOK_KEY !== process.env.MNBNK_WEBHOOK_KEY) {
      throw fastify.httpErrors.forbidden();
    }
    if (status === 'success') {
      const orderIds = reference.split('+');
      console.log(orderIds);
    }
    return reply.send();
  });
};

export default getBill;
