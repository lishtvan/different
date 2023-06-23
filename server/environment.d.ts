declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      GOOGLE_CLIENT_SECRET: string;
      FACEBOOK_CLIENT_SECRET: string;
      TWITTER_CLIENT_SECRET: string;
      PORT: string;
      TOKEN_SECRET: string;
      TOKEN_CHARACTERS: string;
      API_KEY: string;
      NODE_ENV: 'local' | 'development' | 'production';
      WEB_DOMAIN: string;
      S3_CLEANUP_SECRET: string;
      TYPESENSE_HOST: string;
      TYPESENSE_WRITE_API_KEY: string;
      NP_TOKEN: string;
      NP_API_KEY: string;
    }
  }
}

export {};
