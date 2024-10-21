import { CreatePoolData } from "@/components";
import { Timestamp } from "firebase-admin/firestore";

export interface StoredPool extends Omit<CreatePoolData, "duration"> {
  tokenName: string;
  tokenSymbol: string;
  mnemonicPhrase: string;
  claimed: number;
  createdOn: Timestamp;
  closesAt: Timestamp;
  status: "PENDING" | "ACTIVE" | "CLOSED";
  creator: string;
  rewardsDepositTxn?: string;
  gasDepositTxn?: string;
  id?: string;
  rewardRefundTxn?: string;
  gasRefundTxn?: string;
}
