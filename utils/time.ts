export function getNow() {
  return new Date().toISOString();
}

export function getNowTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getSecondsElapsed(timestamp: any) {
  return getNowTimestamp() - Number(timestamp);
}
