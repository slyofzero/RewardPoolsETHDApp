export function isValidEthAddress(address: string) {
  const regex = /^0x[a-fA-F0-9]{40}$/;

  return regex.test(address);
}

export function shortenEthAddress(address: string, show: number = 3) {
  return `${address.slice(0, show)}...${address.slice(address.length - show, address.length)}`;
}
