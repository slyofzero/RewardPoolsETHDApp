import { CreatePoolData } from "@/components";
import { Timestamp } from "firebase-admin/firestore";

export interface StoredPool extends Omit<CreatePoolData, "duration"> {
  tokenName: string;
  tokenSymbol: string;
  mnemonicPhrase: string;
  staked: number;
  active: boolean;
  closesAt: Timestamp;
}
