import { MultipartFile } from '@fastify/multipart';
import { FastifyPluginAsync } from 'fastify';

const uploadMany: FastifyPluginAsync = async (fastify) => {
  fastify.post('/uploadMany', async (req, reply) => {
    // @ts-ignore
    const { images } = req.body;
    if (!Array.isArray(images)) {
      const imageUrls = await fastify.s3.upload(images as unknown as MultipartFile);
      return reply.send([imageUrls]);
    }
    if (!images) return;
    // @ts-ignore
    const uploads = images.map((image) => fastify.s3.upload(image));
    const imageUrls = await Promise.all(uploads);

    return reply.send(imageUrls);
  });
};

export default uploadMany;
