import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { FastifyPluginAsync } from 'fastify';
import { extname } from 'path';
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
    const ext = extname(file.filename);
    const id = fastify.id();
    const Key = `${id}${ext}`;

    const buffer = await file.toBuffer();
    const compressedImage = await sharp(buffer)
      .jpeg({ progressive: true, force: false })
      .withMetadata()
      .toBuffer();

    const params: PutObjectCommandInput = {
      Bucket: 'different.dev',
      Key,
      Body: compressedImage,
      ContentType: file.mimetype,
    };
    await s3.send(new PutObjectCommand(params));
    return reply.send({ imageUrl: `${S3_URL}/${Key}` });
  });
};

export default uploadImage;
