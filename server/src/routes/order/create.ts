import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Order'],
  body: {
    type: 'object',
    required: [
      'listingId',
      'RecipientsPhone',
      'CityRecipientRef',
      'RecipientDepartmentRef',
      'CityRecipientName',
      'RecipientDepartmentName',
      'firstName',
      'lastName',
    ],
    errorMessage: {
      required: {
        CityRecipientRef: 'Населений пункт є обов`язковим',
        RecipientDepartmentRef: 'Відділення є обов`язковим',
        firstName: 'Ім`я є обов`язковим ',
        lastName: 'Фамілія є обов`язковою',
      },
    },
    properties: {
      listingId: { type: 'number' },
      RecipientsPhone: { type: 'string' },
      CityRecipientRef: { type: 'string' },
      RecipientDepartmentRef: { type: 'string' },
      CityRecipientName: { type: 'string' },
      RecipientDepartmentName: { type: 'string' },
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
      CityRecipientRef,
      RecipientDepartmentRef,
      CityRecipientName,
      RecipientDepartmentName,
      firstName,
      lastName,
    } = req.body;

    const listing = await fastify.prisma.listing.update({
      include: { User: true },
      where: { id: listingId, NOT: { status: 'AVAILABLE', userId } },
      data: { status: 'ORDER' },
    });

    // const { trackingNumber, intDocRef, success, translatedErrors } =
    //   await fastify.np.createSafeDelivery({
    //     CityRecipient: CityRecipientRef,
    //     RecipientAddress: RecipientDepartmentRef,
    //     RecipientsPhone,
    //     SendersPhone: listing.User.phone!, // TODO: fix this
    //     Description: listing.title,
    //     Cost: listing.price,
    //     firstName,
    //     lastName,
    //     cardNumber: listing.User.cardNumber!, // TODO: fix this
    //   });
    // if (!success) {
    //   throw fastify.httpErrors.badRequest(`/np ${translatedErrors?.join(' ')} `);
    // }

    await Promise.all([
      fastify.prisma.order.create({
        data: {
          buyerId: userId,
          listingId,
          trackingNumber: 'some',
          intDocRef: 'some',
          sellerId: listing.userId,
        },
        select: { id: true },
      }),
      fastify.prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          npCityName: CityRecipientName,
          npCityRef: CityRecipientRef,
          npDepartmentName: RecipientDepartmentName,
          npDepartmentRef: RecipientDepartmentRef,
          phone: RecipientsPhone,
        },
      }),
      fastify.search.update({ status: 'ORDER', id: listingId }),
    ]);

    return reply.send({});
  });
};

export default createOrder;
