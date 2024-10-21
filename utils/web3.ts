import { provider } from "@/rpc";
import { ethers } from "ethers";
import { erc20Abi } from "./constants";

export function isValidEthAddress(address: string) {
  const regex = /^0x[a-fA-F0-9]{40}$/;

  return regex.test(address);
}

export function shortenEthAddress(address: string, show: number = 3) {
  return `${address.slice(0, show)}...${address.slice(address.length - show, address.length)}`;
}

export async function getTokenDetails(tokenAddress: string) {
  try {
    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);

    // Fetch name and symbol from the token contract
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
    ]);

    const formattedSupply = parseFloat(
      ethers.formatUnits(totalSupply, decimals)
    );

    return { name, symbol, totalSupply: formattedSupply };
  } catch (error) {
    // eslint-disable-next-line
    console.error("Error fetching token details:", error);
  }
}

export async function getTokenBalance(
  address: string,
  token: string
): Promise<number> {
  try {
    const contract = new ethers.Contract(token, erc20Abi, provider);

    const [balance, decimals] = await Promise.all([
      contract.balanceOf(address),
      contract.decimals(),
    ]);

    const tokenBalance = parseFloat(ethers.formatUnits(balance, decimals));

    return tokenBalance;
  } catch (error) {
    return 0;
  }
}
