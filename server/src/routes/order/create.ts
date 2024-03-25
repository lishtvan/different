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
        RecipientsPhone: 'Номер телефону є обов`язковим',
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

const PRISMA_ERRORS: Record<string, string> = {
  P2025: 'На оголошення вже створено замовлення або воно було видалено',
};

const createExpectedErr = (err: string) => {
  return JSON.stringify({ expected: err });
};

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

    let createdOrderId;
    try {
      await fastify.prisma.$transaction(async (tx) => {
        const listing = await tx.listing.update({
          include: { User: true },
          where: { id: listingId, status: 'AVAILABLE', NOT: { userId } },
          data: { status: 'ORDER' },
        });
        await fastify.search.update({ status: 'ORDER', id: listingId });

        const { trackingNumber, intDocRef, success, translatedErrors } =
          await fastify.np.createSafeDelivery({
            CityRecipient: CityRecipientRef,
            RecipientAddress: RecipientDepartmentRef,
            RecipientsPhone,
            SendersPhone: listing.User.phone!,
            Description: listing.title,
            Cost: listing.price,
            firstName,
            lastName,
            cardNumber: listing.User.cardNumber!,
          });
        if (!success) {
          throw fastify.httpErrors.badRequest(
            createExpectedErr(`${translatedErrors?.join('. ')}`)
          );
        }

        /*
          should never fail, only possible case is trackingNumber, intDocRef
          unique constraint
        */
        const [createdOrder] = await Promise.all([
          tx.order.create({
            data: {
              buyerId: userId,
              listingId,
              trackingNumber,
              intDocRef,
              sellerId: listing.userId,
            },
            select: { id: true },
          }),
          tx.user.update({
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
        ]);
        createdOrderId = createdOrder.id;
      });
    } catch (error: any) {
      await fastify.search.update({ status: 'AVAILABLE', id: listingId });
      const prismaErr = PRISMA_ERRORS[error.code];
      if (prismaErr) {
        throw fastify.httpErrors.badRequest(createExpectedErr(prismaErr));
      }
      throw error;
    }

    return reply.send({ orderId: createdOrderId });
  });
};

export default createOrder;
