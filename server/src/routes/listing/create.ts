import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  tags: ['Sale'],
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
      'category',
      'currency',
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
        currency: '/currency Currency is required ',
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
      price: {
        type: 'number',
        maximum: 300000,
        minimum: 5,
        errorMessage: {
          minimum: 'Must be greater than 5  ',
          maximum: 'Contact us to sell such expensive item ',
        },
      },
      currency: { type: 'string' },
      cardNumber: { type: 'string' },
      designer: { type: 'string' },
    },
  } as const,
};

type Schema = { Body: FromSchema<typeof schema.body> };

const createSale: FastifyPluginAsync = async (fastify) => {
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
      currency,
    } = req.body;
    console.log({
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
      currency,
    });
    return reply.send({
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
    });

    // await fastify.prisma.sale.create({
    //   data: {
    //     name,
    //     size,
    //     description,
    //     userId,
    //     condition,
    //     imageKeys,
    //     trackNumber,
    //   },
    // });

    // return reply.send();
  });
};

export default createSale;
