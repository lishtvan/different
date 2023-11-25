import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { LISTINGS_COLLECTION_NAME } from '../../constants/typesense';

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

const createOrder: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/create', { schema }, async (req, reply) => {
    const { userId } = req;
    const {
      listingId,
      RecipientsPhone,
      CityRecipient,
      RecipientAddress,
      firstName,
      lastName,
    } = req.body;

    const listing = await fastify.prisma.listing.findUnique({ where: { id: listingId } });

    if (!listing || listing.status !== 'AVAILABLE') throw fastify.httpErrors.notFound();

    const { trackingNumber, intDocRef, success, translatedErrors } =
      await fastify.np.createSafeDelivery({
        CityRecipient,
        RecipientAddress,
        RecipientsPhone,
        SendersPhone: '380965134969', // TODO: fix this
        Description: listing.title,
        Cost: listing.price,
        firstName,
        lastName,
        cardNumber: '5168757427716644', // TODO: fix this
      });
    if (!success) {
      throw fastify.httpErrors.badRequest(`/np ${translatedErrors?.join(' ')} `);
    }

    await Promise.all([
      fastify.prisma.order.create({
        data: {
          buyerId: userId,
          listingId,
          trackingNumber,
          intDocRef,
          sellerId: listing.userId,
        },
        select: { id: true },
      }),
      fastify.prisma.listing.update({
        where: { id: listingId },
        data: { status: 'ORDER' },
      }),
      fastify.prisma.user.update({
        where: { id: userId },
        data: { phone: RecipientsPhone },
      }),
    ]);

    await fastify.typesense
      .collections(LISTINGS_COLLECTION_NAME)
      .documents()
      .update({ status: 'ORDER', id: listing.id.toString() }, {});

    return reply.send();
  });
};

export default createOrder;
