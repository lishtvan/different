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

const IMAGE_CONFIG = {
  local: {
    ImageRootUrl: 'https://s3.eu-central-1.amazonaws.com/different.dev',
    Bucket: 'different.dev',
  },
  production: {
    ImageRootUrl: 'https://d3g9kgb9a5luhg.cloudfront.net',
    Bucket: 'different.prod',
  },
};

const { ImageRootUrl, Bucket } = IMAGE_CONFIG[process.env.NODE_ENV];

const uploadImage: FastifyPluginAsync = async (fastify) => {
  fastify.post('/upload', async (req, reply) => {
    const file = await req.file();

    if (!file) throw fastify.httpErrors.badRequest();

    const Key = `${fastify.id()}.webp`;

    const buffer = await file.toBuffer();
    const Body = await sharp(buffer).rotate().webp().toBuffer();

    const params: PutObjectCommandInput = {
      Bucket,
      Key,
      Body,
      ContentType: 'image/webp',
    };

    await s3.send(new PutObjectCommand(params));
    return reply.send({ imageUrl: `${ImageRootUrl}/${Key}` });
  });
};

export default uploadImage;
