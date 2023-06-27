import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Order'],
  body: {
    type: 'object',
    required: [
      'listingId',
      'RecipientsPhone',
      'CityRecipient',
      'RecipientAddress',
      'firstName',
      'lastName',
    ],
    errorMessage: {
      required: {
        CityRecipient: '/CityRecipient Населений пункт є обов`язковим ',
        RecipientAddress: '/RecipientAddress Відділення є обов`язковим ',
        firstName: '/firstName Ім`я є обов`язковим ',
        lastName: '/lastName Фамілія є обов`язковою',
      },
    },
    properties: {
      listingId: { type: 'number' },
      RecipientsPhone: { type: 'string' },
      CityRecipient: { type: 'string' },
      RecipientAddress: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const getListing: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/create', { schema }, async (req, reply) => {
    const { userId } = req.cookies;
    const {
      listingId,
      RecipientsPhone,
      CityRecipient,
      RecipientAddress,
      firstName,
      lastName,
    } = req.body;

    console.log({
      userId,
      listingId,
      RecipientsPhone,
      CityRecipient,
      RecipientAddress,
      firstName,
      lastName,
    });

    return reply.send({ orderId: 1 });
  });
};

export default getListing;
