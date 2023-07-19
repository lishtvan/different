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
    const { userId } = req.cookies;
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

    const { trackingNumber, intDocRef } = await fastify.np.createSafeDelivery({
      CityRecipient,
      RecipientAddress,
      RecipientsPhone,
      SendersPhone: listing.phone,
      Description: listing.title,
      Cost: listing.price,
      firstName,
      lastName,
      cardNumber: listing.cardNumber.replace(/\s/g, ''),
    });
    if (!trackingNumber) throw fastify.httpErrors.internalServerError();

    await Promise.all([
      fastify.prisma.order.create({
        data: { buyerId: Number(userId), listingId, trackingNumber, intDocRef },
        select: { id: true },
      }),
      fastify.prisma.listing.update({
        where: { id: listingId },
        data: { status: 'ORDER' },
      }),
      fastify.prisma.user.update({
        where: { id: Number(userId) },
        data: { phone: RecipientsPhone },
      }),
    ]);

    await fastify.typesense
      .collections(LISTINGS_COLLECTION_NAME)
      .documents()
      .update({ status: 'ORDER', id: listing.id.toString() });

    return reply.send();
  });
};

export default createOrder;
