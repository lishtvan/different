import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { FastifyPluginAsync } from 'fastify';
import sharp = require('sharp');

const s3 = new S3Client({
  region: 'eu-central-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});
const S3_URL = 'https://s3.eu-central-1.amazonaws.com/different.dev';

const uploadImage: FastifyPluginAsync = async (fastify) => {
  fastify.post('/upload', async (req, reply) => {
    const file = await req.file();

    if (!file) throw fastify.httpErrors.badRequest();

    const Key = fastify.id();

    const buffer = await file.toBuffer();
    const compressedImage = await sharp(buffer).rotate().webp().toBuffer();

    const params: PutObjectCommandInput = {
      Bucket: 'different.dev',
      Key,
      Body: compressedImage,
      ContentType: 'image/webp',
    };

    await s3.send(new PutObjectCommand(params));
    return reply.send({ imageUrl: `${S3_URL}/${Key}` });
  });
};

export default uploadImage;
