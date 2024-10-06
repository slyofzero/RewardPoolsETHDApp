import { ethers } from "ethers";
import Web3 from "web3";

export const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL
);
export const etherScanProvider = new ethers.EtherscanProvider(
  process.env.NODE_ENV === "development" ? "sepolia" : "mainnet",
  process.env.ETHERSCAN_API_KEY
);
export const web3: Web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
