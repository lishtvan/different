import fp from 'fastify-plugin';
import S3 = require('aws-sdk/clients/s3');
import sharp = require('sharp');
import { S3Plugin } from '../types/s3';
import path = require('path');

export default fp(async (fastify) => {
  const { S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

  const s3 = new S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  });
  const Bucket = S3_BUCKET_NAME;

  fastify.decorate<S3Plugin>('s3', {
    upload: async (file) => {
      const buffer = await file.toBuffer();
      const compressed = await sharp(buffer).webp().toBuffer();
      const id = fastify.id();
      const extension = path.extname(file.filename);

      const params = {
        Bucket,
        Key: `${id}${extension}`,
        Body: compressed,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      };

      const { Location } = await s3.upload(params).promise();
      return Location;
    },
    deleteImage: async (Key) => {
      await s3.deleteObject({ Bucket, Key }).promise();
      return;
    },
    deleteImages: async (keys) => {
      const Objects = keys.map((Key) => ({ Key }));
      await s3.deleteObjects({ Bucket, Delete: { Objects } }).promise();
      return;
    },
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    s3: S3Plugin;
  }
}
