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
