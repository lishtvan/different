import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { LISTINGS_COLLECTION_NAME } from '../../constants/typesense';

// TODO: recheck schema
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
      tags: {
        type: 'array',
        maxItems: 3,
        items: { type: 'string' },
        errorMessage: { minItems: 'Ви можете обрати максимум 3 теги' },
      },
      title: {
        type: 'string',
        maxLength: 80,
        errorMessage: {
          maxLength: 'Заголовок має бути не довшим ніж 80 символів',
        },
      },
      description: {
        type: 'string',
        maxLength: 1000,
        errorMessage: {
          maxLength: 'Опис має бути не довшим ніж 1000 символів',
        },
      },
      size: { type: 'string' },
      condition: { type: 'string' },
      category: { type: 'string' },
      imageUrls: {
        type: 'array',
        minItems: 1,
        maxItems: 8,
        items: { type: 'string' },
        errorMessage: {
          minItems: 'Необхідно додати мінімум одну фотографію',
          maxItems: 'Можна завантажити максимум 8 фото',
        },
      },
      price: {
        type: 'number',
        maximum: 300000,
        minimum: 1,
        errorMessage: {
          minimum: 'Ціна має бути більшою ніж 1 грн',
          maximum: 'Занадто багато',
        },
      },
      cardNumber: { type: 'string' },
      designer: { type: 'string' },
      phone: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const createListing: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/create', { schema }, async (req, reply) => {
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
      phone,
    } = req.body;

    const listing = await fastify.prisma.listing.create({
      select: {
        id: true,
        description: true,
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
        status: 'AVAILABLE',
        designer,
        condition,
        tags,
        category,
        price,
        imageUrls,
        description,
        userId,
      },
    });
    await fastify.prisma.user.update({
      where: { id: userId },
      data: { phone, cardNumber },
    });

    // TODO: refactor this and add transaction
    await fastify.typesense
      .collections(LISTINGS_COLLECTION_NAME)
      .documents()
      .create({ ...listing, id: listing.id.toString(), sellerId: userId.toString() });
    return reply.send({ listingId: listing.id });
  });
};

export default createListing;
