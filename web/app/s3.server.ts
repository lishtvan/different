import type { UploadHandler } from "@remix-run/node";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import hyperid from "hyperid";

const s3 = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!!,
  },
});

const id = hyperid({ urlSafe: true, fixedLength: true });

const convertToBuffer = async (a: AsyncIterable<Uint8Array>) => {
  const result = [];
  for await (const chunk of a) {
    result.push(chunk);
  }
  return Buffer.concat(result);
};

const compress = (buffer: Buffer) =>
  sharp(buffer)
    .jpeg({ progressive: true, force: false })
    .withMetadata()
    .toBuffer();

const getImageKey = async (buffer: Buffer) => {
  const { width, height } = await sharp(buffer).metadata();
  const imageKey = `${id()}:w=${width}&h=${height}`;
  return imageKey;
};
const S3_URL = "https://s3.eu-central-1.amazonaws.com/different.dev";

const uploadStreamToS3 = async (
  data: AsyncIterable<Uint8Array>,
  key: string,
  contentType: string
) => {
  const buffer = await convertToBuffer(data);
  const [imageKey, compressedImage] = await Promise.all([
    getImageKey(buffer),
    compress(buffer),
  ]);

  const params: PutObjectCommandInput = {
    Bucket: "different.dev",
    Key: imageKey,
    Body: compressedImage,
    ContentType: contentType,
  };
  s3.send(new PutObjectCommand(params));

  return `${S3_URL}/${imageKey}`;
};

export const s3UploaderHandler: UploadHandler = async ({
  data,
  filename,
  contentType,
}) => uploadStreamToS3(data, filename!, contentType);
