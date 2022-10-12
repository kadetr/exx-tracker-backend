import { IUserDoc } from "./custom";


export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      NODE_ENV: string;
      MONGO_URI?: string;
      JWT_SECRET: Secret;
      
    }
  }
}