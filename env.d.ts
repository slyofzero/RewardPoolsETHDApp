/* eslint-disable */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /* --------------------------------- Examples --------------------------------- */
      ENCRYPTION_KEY: string;
      FIREBASE_KEY: string;
    }
  }
}

export {};
