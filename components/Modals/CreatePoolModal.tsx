import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from ".";
import { stakingPoolGasEth } from "@/utils/constants";
import { Copy } from "../Common";
import { shortenEthAddress } from "@/utils/web3";
import { useUser } from "@/state";
import { CreatePoolData } from "../Pages";
import { clientFetcher } from "@/utils/api";
import { sleep } from "@/utils/time";
import { useRouter } from "next/router";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  poolData: CreatePoolData;
}

type VerificationState = "verifying" | "failed" | "verified" | "pending";

export function CreatePoolModal({ setShowModal, poolData }: Props) {
  const [verificationState, setVerificationState] =
    useState<VerificationState>("pending");

  const router = useRouter();
  const { user } = useUser();

  const { size, reward, pool, tokenSymbol } = poolData;
  const rewardBalance = parseFloat((size * (reward / 100)).toFixed(6));

  const verifyRewardDeposit = async () => {
    if (verificationState === "pending" || verificationState === "failed") {
      setVerificationState("verifying");
      let attempt = 0;

      for (const attempt_number of Array.from(Array(20).keys())) {
        attempt = attempt_number + 1;
        const data = await clientFetcher(`/api/verify/reward?pool=${pool}`);

        if (data.response === 200) {
          const { data: verificationData } = data;
          break;
        }
        await sleep(5000);
      }

      if (attempt < 20) {
        setVerificationState("verified");
        await sleep(5000);
        router.push("/dashboard");
      } else setVerificationState("failed");
    }
  };

  return (
    <Modal
      className="p-4 flex flex-col gap-8 text-base text-center justify-center"
      setShowModal={setShowModal}
    >
      <h6>
        To create a staking pool, you&apos;d need to deposit {rewardBalance}{" "}
        {tokenSymbol} to ensure staking rewards and {stakingPoolGasEth} ETH to
        serve as gas fees for reward distribution. If any tokens or ETH are left
        after reward distribution, they&apos;d be returned back to the wallet
        you are currently logged in with.
      </h6>

      <span className="flex gap-1 whitespace-nowrap items-center mx-auto">
        Your Wallet - {shortenEthAddress(user || "", 10)}
      </span>

      <span className="flex gap-1 items-center">
        <Copy value={pool} />
        <h6 className="hidden md:block p-2 bg-gray-800 rounded-md">{pool}</h6>

        <h6 className="md:hidden p-2 bg-gray-800 rounded-md">
          {shortenEthAddress(pool || "", 14)}
        </h6>
      </span>

      <div className="flex flex-col gap-4">
        <button
          onClick={verifyRewardDeposit}
          className="text-black bg-white rounded-md font-semibold px-4 text-sm p-2 capitalize"
        >
          {verificationState === "pending"
            ? `I have deposited ${rewardBalance} ${tokenSymbol}`
            : verificationState === "verifying"
              ? `${verificationState}...`
              : verificationState}
        </button>

        <button
          onClick={verifyRewardDeposit}
          className="text-black bg-white rounded-md font-semibold px-4 text-sm p-2 capitalize"
        >
          {verificationState === "pending"
            ? `I have deposited ${stakingPoolGasEth} ETH`
            : verificationState === "verifying"
              ? `${verificationState}...`
              : verificationState}
        </button>
      </div>
    </Modal>
  );
}
