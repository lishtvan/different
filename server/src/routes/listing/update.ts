import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { LISTINGS_COLLECTION_NAME } from '../../constants/typesense';

const schema = {
  tags: ['Listing'],
  body: {
    type: 'object',
    required: [
      'title',
      'size',
      'designer',
      'condition',
      'price',
      'cardNumber',
      'imageUrls',
      'category',
      'listingId',
      'phone',
    ],
    errorMessage: {
      required: {
        title: 'Заголовок є обовʼязковим',
        size: 'Розмір є обовʼязковим',
        designer: 'Дизайнер є обовʼязковим',
        condition: 'Стан є обовʼязковим',
        price: 'Ціна є обовʼязковою',
        category: 'Категорія є обовʼязковою',
        imageUrls: 'Необхідно додати мінімум одну фотографію',
        phone: 'Номер телефону є обовʼязковим',
        cardNumber: 'Номер карти є обовʼязковим',
      },
    },
    properties: {
      listingId: { type: 'number' },
      tags: {
        type: 'array',
        maxItems: 3,
        items: { type: 'string' },
        errorMessage: {
          minItems: 'Ви можете обрати максимум 3 теги ',
        },
      },
      title: {
        type: 'string',
        maxLength: 80,
        errorMessage: {
          maxLength: 'Заголовок має бути не довшим ніж 80 символів ',
        },
      },
      description: {
        type: 'string',
        maxLength: 1000,
        errorMessage: {
          maxLength: 'Опис має бути не довшим ніж 1000 символів ',
        },
      },
      size: { type: 'string' },
      condition: { type: 'string' },
      category: { type: 'string' },
      imageUrls: {
        type: 'array',
        minItems: 1,
        items: { type: 'string' },
        errorMessage: {
          minItems: 'Необхідно додати мінімум одну фотографію ',
        },
      },
      price: {
        type: 'number',
        maximum: 300000,
        minimum: 6,
        errorMessage: {
          minimum: 'Ціна має бути більшою ніж 20 грн ',
          maximum: 'Contact us to sell such expensive item ',
        },
      },
      cardNumber: { type: 'string' },
      designer: { type: 'string' },
      cardNumberError: { type: 'string' },
      phone: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const updateListing: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/update', { schema }, async (req, reply) => {
    const { userId } = req;
    const {
      title,
      size,
      designer,
      description,
      condition,
      tags,
      price,
      cardNumber,
      category,
      imageUrls,
      listingId,
      cardNumberError,
      phone,
    } = req.body;

    if (cardNumberError) {
      throw fastify.httpErrors.badRequest(`/cardNumber ${cardNumberError} `);
    }

    const listingToUpdate = await fastify.prisma.listing.findUnique({
      where: { id: listingId, userId },
    });

    if (!listingToUpdate) throw fastify.httpErrors.unauthorized();
    if (listingToUpdate.status !== 'AVAILABLE') throw fastify.httpErrors.badRequest();

    const listing = await fastify.prisma.listing.update({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        size: true,
        designer: true,
        condition: true,
        tags: true,
        category: true,
        price: true,
        imageUrls: true,
        status: true,
      },
      data: {
        title,
        size,
        designer,
        condition,
        tags,
        category,
        price,
        imageUrls,
        description,
      },
    });

    await fastify.prisma.user.update({
      where: { id: userId },
      data: { phone, cardNumber },
    });

    await fastify.typesense
      .collections(LISTINGS_COLLECTION_NAME)
      .documents()
      .update({ ...listing, id: listing.id.toString() }, {});

    return reply.send();
  });
};

export default updateListing;
