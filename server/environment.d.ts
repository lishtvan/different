declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOMAIN: string;
      DATABASE_URL: string;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      PORT: string;
      TOKEN_SECRET: string;
      TOKEN_CHARACTERS: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      S3_BUCKET_NAME: string;
      API_KEY: string;
      NODE_ENV: string;
    }
  }
}

export {};
