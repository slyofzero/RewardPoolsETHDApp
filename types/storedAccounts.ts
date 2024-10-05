import { Timestamp } from "firebase-admin/firestore";

export interface StoredAccount {
  address: string;
  phrase: string;
  registerdOn: Timestamp;
  signedIn: boolean;
}
