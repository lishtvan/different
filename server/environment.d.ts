declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: 'local' | 'production';
      DATABASE_URL: string;
      TYPESENSE_WRITE_API_KEY: string;
      NP_TOKEN: string;
      NP_API_KEY: string;
      S3_ACCESS_KEY: string;
      S3_SECRET_KEY: string;
      CLOUD_API_KEY: string;
    }
  }
}

export {};
