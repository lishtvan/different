import { FastifyPluginAsync } from 'fastify';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
  params: {
    type: 'object',
    required: ['s3DeleteKey'],
    properties: {
      s3DeleteKey: { type: 'string' },
    },
  } as const,
};

type Schema = { Params: FromSchema<typeof schema.params> };

const getListing: FastifyPluginAsync = async (fastify) => {
  fastify.get<Schema>('/getAll/:s3DeleteKey', { schema }, async (req, reply) => {
    const { s3DeleteKey } = req.params;
    if (s3DeleteKey !== process.env.S3_CLEANUP_SECRET) {
      throw fastify.httpErrors.forbidden();
    }
    const images: string[] = [];
    const listings = await fastify.prisma.listing.findMany({
      select: {
        imageUrls: true,
      },
    });
    listings.forEach((listing) => {
      listing.imageUrls.forEach((imageUrl) => {
        images.push(imageUrl);
      });
    });
    const users = await fastify.prisma.user.findMany({
      select: {
        avatarUrl: true,
      },
    });
    users.forEach((user) => {
      if (user.avatarUrl) images.push(user.avatarUrl);
    });
    return reply.send(images);
  });
};

export default getListing;
