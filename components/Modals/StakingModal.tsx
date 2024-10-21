import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from ".";
import { shortenEthAddress } from "@/utils/web3";
import { useUser } from "@/state";
import { clientFetcher, clientPoster } from "@/utils/api";
import { sleep } from "@/utils/time";
import { useRouter } from "next/router";
import { StoredPool } from "@/types";
import { classNames } from "@/utils";
import { ClaimData } from "@/pages/api/pool/[id]";
import { SendRewardData } from "@/pages/api/sendReward";
import { JobStatusApiResponse } from "@/pages/api/jobStatus";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  poolData: StoredPool;
  claimData?: ClaimData;
}

type VerificationState = "verifying" | "failed" | "verified" | "pending";

export function StakingModal({ setShowModal, poolData, claimData }: Props) {
  const [rewardDepositState, setRewardDepositState] =
    useState<VerificationState>("pending");

  const router = useRouter();
  const { user } = useUser();

  const { pool, tokenSymbol } = poolData;
  const rewardAmount = claimData?.reward;

  const verifyStakeDeposit = async () => {
    if (
      Number(rewardAmount) > 0 &&
      (rewardDepositState === "pending" || rewardDepositState === "failed")
    ) {
      setRewardDepositState("verifying");

      const sendRewardResponse = await clientPoster<SendRewardData>(
        `/api/sendReward?pool=${pool}`
      );
      const jobId = sendRewardResponse.data.jobId;

      let attempt = 0;

      for (const attempt_number of Array.from(Array(20).keys())) {
        attempt = attempt_number + 1;
        const data = await clientFetcher<JobStatusApiResponse>(
          `/api/jobStatus?jobId=${jobId}`
        );

        if (data.data.status === "Completed") {
          break;
        }
        await sleep(5000);
      }

      if (attempt < 20) {
        setRewardDepositState("verified");
        await sleep(5000);
        router.push("/dashboard");
      } else setRewardDepositState("failed");
    }
  };

  return (
    <Modal
      className="p-4 flex flex-col gap-8 text-base text-center justify-center"
      setShowModal={setShowModal}
    >
      <h6>
        You hold {claimData?.holding.toFixed(2)}% of{" "}
        <strong>{tokenSymbol}&apos;s</strong> total supply, which makes you
        eligible for{" "}
        <strong>
          {claimData?.reward} {tokenSymbol}
        </strong>{" "}
        as the reward from the reward pool. Click the button below to claim your
        reward, the tokens would be sent to the wallet address you are logged in
        with.
      </h6>

      <span className="flex gap-1 whitespace-nowrap items-center mx-auto">
        Your Wallet - {shortenEthAddress(user || "", 10)}
      </span>

      <button
        onClick={verifyStakeDeposit}
        className={classNames(
          "text-black rounded-md font-semibold px-4 text-sm p-2 capitalize",
          Number(rewardAmount) > 0 ? "bg-white" : "bg-gray-600 cursor-default"
        )}
      >
        {rewardDepositState === "pending"
          ? `Claim ${rewardAmount || 0} ${tokenSymbol}`
          : rewardDepositState === "verifying"
            ? `${rewardDepositState}...`
            : rewardDepositState}
      </button>
    </Modal>
  );
}
