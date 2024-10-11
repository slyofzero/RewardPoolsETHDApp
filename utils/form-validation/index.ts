import { getTokenDetails } from "../web3";
import { MatchFuncType } from "./types";

export * from "./types";

// ------------------------------ To check if the name is valid ------------------------------
export const isValidName: MatchFuncType = (name) => {
  const namePattern = /^[A-Za-z\s]+$/;
  const isNameValid = namePattern.test(name);

  if (!isNameValid) {
    return "Please enter a valid name.";
  }

  return true;
};

// ------------------------------ To check if the address is valid ------------------------------
export const isValidEthAddress: MatchFuncType = (address) => {
  const ethAddressPattern = /^0x[a-fA-F0-9]{40}$/;
  const isAddressValid = ethAddressPattern.test(address);

  if (!isAddressValid) {
    return "Please enter a valid Ethereum address.";
  }

  return true;
};

// ------------------------------ To check if the address is valid ------------------------------
export const isValidERC20Token: MatchFuncType = async (address) => {
  const details = await getTokenDetails(address);

  if (!details) return "Please enter a valid ERC20 token address";

  return true;
};

// ------------------------------ To check if the number is valid ------------------------------
export const isValidNumber: MatchFuncType = (number) => {
  const numberPattern = /^[0-9]+$/; // This pattern matches only digits (0-9)
  const isNumberValid = numberPattern.test(number);

  if (!isNumberValid) {
    return "Please enter a valid number.";
  }

  return true;
};

// ------------------------------ To check if the number is percentage ------------------------------
export const isValidPercentage: MatchFuncType = (number) => {
  if (Number(number) > 100) {
    return "Please enter a valid percentage.";
  }

  return true;
};

// ------------------------------ To check if the number is percentage ------------------------------
export const isValidUrl: MatchFuncType = (url) => {
  const isUrl = url.startsWith("https://") || url.startsWith("http://");

  if (!isUrl) {
    return "Please enter a valid url.";
  }

  return true;
};
