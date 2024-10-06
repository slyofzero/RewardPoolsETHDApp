import { Timestamp } from "firebase-admin/firestore";

export interface StoredAccount {
  address: string;
  createdOn: Timestamp;
  verificationTxn: string;
  id?: string;
}
