import type { UploadHandler, UploadHandlerPart } from "@remix-run/node";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import hyperid from "hyperid";
import { streamMultipart } from "@web3-storage/multipart-parser";
import parallel from "@async-generators/parallel";

export const parseMultipartFormData = async (
  request: Request,
  uploadHandler: UploadHandler
): Promise<FormData> => {
  let contentType = request.headers.get("Content-Type") || "";
  let [type, boundary] = contentType.split(/\s*;\s*boundary=/);

  if (!request.body || !boundary || type !== "multipart/form-data") {
    throw new TypeError("Could not parse content as FormData.");
  }

  let formData = new FormData();

  let parts: AsyncIterable<UploadHandlerPart & { done?: true }> =
    streamMultipart(request.body, boundary);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for await (let part of parallel(parts, async (value) => {
    await new Promise((r) => setTimeout(r, 100));
    if (value.done) return;

    if (typeof value.filename === "string") {
      value.filename = value.filename.split(/[/\\]/).pop();
    }

    const result = await uploadHandler(value);
    if (typeof result !== "undefined" && result !== null) {
      formData.append(value.name, result as any);
    }
    return value;
    // eslint-disable-next-line no-empty
  })) {
  }

  return formData;
};

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

const getImageDimensions = (buffer: Buffer) => sharp(buffer).metadata();

const uploadStreamToS3 = async (
  data: AsyncIterable<Uint8Array>,
  key: string,
  contentType: string
) => {
  const S3_URL = "https://s3.eu-central-1.amazonaws.com/different.dev";

  const buffer = await convertToBuffer(data);
  const [{ width, height }, compressedImage] = await Promise.all([
    getImageDimensions(buffer),
    compress(buffer),
  ]);

  const imageKey = `${id()}:w=${width}&h=${height}`;

  const params: PutObjectCommandInput = {
    Bucket: "different.dev",
    Key: imageKey,
    Body: compressedImage,
    ContentType: contentType,
  };

  const res = await s3.send(new PutObjectCommand(params));
  console.log(res);
  return `${S3_URL}/${imageKey}`;
};

export const s3UploaderHandler: UploadHandler = async ({
  data,
  filename,
  contentType,
}) => {
  const res = await uploadStreamToS3(data, filename!, contentType);
  return res;
};
