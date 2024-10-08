import { Timestamp } from "firebase-admin/firestore";

export interface StoredStakings {
  user: string;
  amount: number;
  pool: string;
  stakedOn: Timestamp;
}
