import { Timestamp } from "firebase-admin/firestore";

export interface StoredStakes {
  user: string;
  amount: number;
  pool: string;
  stakedOn: Timestamp;
}
