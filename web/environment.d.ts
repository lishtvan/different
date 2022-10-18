declare global {
  interface Window {
    ENV: {
      API_DOMAIN: string;
      APP_DOMAIN: string;
      TYPESENSE_API_KEY: string;
    };
  }
}

export {};
