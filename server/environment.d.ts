declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      GOOGLE_CLIENT_SECRET: string;
      PORT: string;
      TOKEN_SECRET: string;
      TOKEN_CHARACTERS: string;
      NODE_ENV: 'local' | 'development' | 'production';
      WEB_DOMAIN: string;
      S3_CLEANUP_SECRET: string;
      TYPESENSE_HOST: string;
      TYPESENSE_WRITE_API_KEY: string;
      NP_TOKEN: string;
      NP_API_KEY: string;
      MNBNK_WEBHOOK_KEY: string;
      API_DOMAIN: string;
      MNBNK_TOKEN: string;
    }
  }
}

export {};
