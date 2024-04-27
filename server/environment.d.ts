declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: 'local' | 'development' | 'production';
      DATABASE_URL: string;
      TOKEN_SECRET: string;
      TOKEN_CHARACTERS: string;
      TYPESENSE_WRITE_API_KEY: string;
      NP_TOKEN: string;
      NP_API_KEY: string;
      S3_ACCESS_KEY: string;
      S3_SECRET_KEY: string;
    }
  }
}

export {};
