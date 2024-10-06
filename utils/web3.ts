import { provider } from "@/rpc";
import { ethers } from "ethers";

export function isValidEthAddress(address: string) {
  const regex = /^0x[a-fA-F0-9]{40}$/;

  return regex.test(address);
}

export function shortenEthAddress(address: string, show: number = 3) {
  return `${address.slice(0, show)}...${address.slice(address.length - show, address.length)}`;
}

// ABI that includes the name and symbol methods
const tokenABI = [
  // Only the functions we need
  "function name() view returns (string)",
  "function symbol() view returns (string)",
];

export async function getTokenDetails(
  tokenAddress: string
): Promise<{ name: string; symbol: string } | void> {
  try {
    const contract = new ethers.Contract(tokenAddress, tokenABI, provider);

    // Fetch name and symbol from the token contract
    const name = await contract.name();
    const symbol = await contract.symbol();

    return { name, symbol };
  } catch (error) {
    // eslint-disable-next-line
    console.error("Error fetching token details:", error);
  }
}
