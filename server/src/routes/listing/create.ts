import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

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
      'shipping',
      'imageUrls',
      'category',
    ],
    errorMessage: {
      required: {
        title: '/title Title is required ',
        size: '/size Size is required ',
        designer: '/designer Designer is required ',
        condition: '/condition Condition is required ',
        price: '/price Price is required ',
        cardNumber: '/cardNumber Card number is required ',
        shipping: '/shipping Shipping is required ',
        category: '/category Category is required ',
        imageUrls: '/imageUrls At least one photo is required ',
      },
    },
    properties: {
      tags: { type: 'string' },
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
      shipping: {
        type: 'array',
        minItems: 1,
        items: { type: 'string' },
        errorMessage: {
          minItems: 'At least one delivery service must be selected ',
        },
      },
      imageUrls: {
        type: 'array',
        minItems: 1,
        items: { type: 'string' },
        errorMessage: {
          minItems: 'At least one photo is required ',
        },
      },
      price: {
        type: 'number',
        maximum: 300000,
        minimum: 5,
        errorMessage: {
          minimum: 'Must be greater than 5  ',
          maximum: 'Contact us to sell such expensive item ',
        },
      },
      cardNumber: { type: 'number' },
      designer: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const createListing: FastifyPluginAsync = async (fastify) => {
  fastify.post<Schema>('/create', { schema }, async (req, reply) => {
    const {
      title,
      size,
      designer,
      description,
      condition,
      tags,
      price,
      cardNumber,
      shipping,
      category,
      imageUrls,
    } = req.body;

    await fastify.prisma.listing.create({
      data: {
        title,
        size,
        designer,
        description,
        condition,
        tags,
        price,
        cardNumber,
        shipping,
        category,
        imageUrls,
        userId: Number(req.cookies.userId),
      },
    });

    return reply.send();
  });
};

export default createListing;
