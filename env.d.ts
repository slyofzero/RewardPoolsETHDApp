/* eslint-disable */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /* --------------------------------- Examples --------------------------------- */
      RPC_URL: string;
      ENCRYPTION_KEY: string;
      NEXT_SERVER_URL: string;
      NEXT_PUBLIC_VERIFICATION_ADDRESS: string;
      ETHERSCAN_API_KEY: string;
      FIREBASE_KEY: string;
    }
  }
}

export {};
