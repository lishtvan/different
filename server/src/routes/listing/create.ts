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
      'phone',
    ],
    errorMessage: {
      required: {
        title: '/title Title is required ',
        size: '/size Size is required ',
        designer: '/designer Designer is required ',
        condition: '/condition Condition is required ',
        price: '/price Price is required ',
        category: '/category Category is required ',
        imageUrls: '/imageUrls At least one photo is required ',
        cardNumber: '/cardNumber Card number is required ',
        phone: '/phone Phone Number is required',
      },
    },
    properties: {
      tags: {
        type: 'array',
        maxItems: 3,
        items: { type: 'string' },
        errorMessage: { minItems: 'You can select maximum 3 tags ' },
      },
      title: {
        type: 'string',
        maxLength: 80,
        errorMessage: {
          maxLength: 'Title length must not be longer than 80 characters ',
        },
      },
      description: {
        type: 'string',
        maxLength: 1000,
        errorMessage: {
          maxLength: 'Description length must not be longer than 1000 characters ',
        },
      },
      size: { type: 'string' },
      condition: { type: 'string' },
      category: { type: 'string' },
      imageUrls: {
        type: 'array',
        minItems: 1,
        items: { type: 'string' },
        errorMessage: { minItems: 'At least one photo is required ' },
      },
      price: {
        type: 'number',
        maximum: 300000,
        minimum: 6,
        errorMessage: {
          minimum: 'Must be greater than 5 ',
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

const createListing: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/create', { schema }, async (req, reply) => {
    const { userId } = req.cookies;
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
      cardNumberError,
      phone,
    } = req.body;

    if (cardNumberError) {
      throw fastify.httpErrors.badRequest(`/cardNumber ${cardNumberError} `);
    }

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
        cardNumber,
        phone,
        userId: Number(userId),
      },
    });

    await fastify.typesense
      .collections(LISTINGS_COLLECTION_NAME)
      .documents()
      .create({ ...listing, id: listing.id.toString(), sellerId: userId });
    return reply.send({ listingId: listing.id });
  });
};

export default createListing;
