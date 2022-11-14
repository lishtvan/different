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
      NODE_ENV: string;
      WEB_DOMAIN: string;
    }
  }
}

export {};
