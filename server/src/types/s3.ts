import { MultipartFile } from '@fastify/multipart';

export interface S3Plugin {
  upload: (file: MultipartFile) => Promise<string>;
  deleteImage: (key: string) => Promise<void>;
  deleteImages: (keys: string[]) => Promise<void>;
}
