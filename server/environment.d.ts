declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOMAIN: string;
      DATABASE_URL: string;
      GOOGLE_CLIENT_SECRET: string;
      FACEBOOK_CLIENT_SECRET: string;
      TWITTER_CLIENT_SECRET: string;
      PORT: string;
      TOKEN_SECRET: string;
      TOKEN_CHARACTERS: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      S3_BUCKET_NAME: string;
      API_KEY: string;
      NODE_ENV: string;
      WEB_DOMAIN: string;
    }
  }
}

export {};
