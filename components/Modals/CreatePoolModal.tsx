import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal } from ".";
import { stakingPoolGasEth } from "@/utils/constants";
import { Copy } from "../Common";
import { shortenEthAddress } from "@/utils/web3";
import { useUser } from "@/state";
import { clientFetcher } from "@/utils/api";
import { sleep } from "@/utils/time";
import { useRouter } from "next/router";
import { VerifyRewardDepositResponse } from "@/pages/api/verify/reward";
import { StoredPool } from "@/types";
import { ShowWhen } from "../Utils";
import { VerifyGasDepositResponse } from "@/pages/api/verify/gas";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  poolData: StoredPool;
}

type VerificationState = "verifying" | "failed" | "verified" | "pending";

export function CreatePoolModal({ setShowModal, poolData }: Props) {
  const [rewardDepositState, setRewardDepositState] =
    useState<VerificationState>("pending");
  const [gasDepositState, setGasDepositState] =
    useState<VerificationState>("pending");

  const router = useRouter();
  const { user } = useUser();

  const { size, reward, pool, tokenSymbol } = poolData;
  const rewardBalance = parseFloat((size * (reward / 100)).toFixed(6));

  useEffect(() => {
    if (rewardDepositState === "verified" && gasDepositState === "verified") {
      setShowModal(false);
    }
  }, [rewardDepositState, gasDepositState]);

  const verifyRewardDeposit = async () => {
    if (rewardDepositState === "pending" || rewardDepositState === "failed") {
      setRewardDepositState("verifying");
      let attempt = 0;

      for (const attempt_number of Array.from(Array(20).keys())) {
        attempt = attempt_number + 1;
        const data = await clientFetcher<VerifyRewardDepositResponse>(
          `/api/verify/reward?pool=${pool}`
        );

        if (data.response === 200) {
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

  const verifyGasDeposit = async () => {
    if (gasDepositState === "pending" || gasDepositState === "failed") {
      setGasDepositState("verifying");
      let attempt = 0;

      for (const attempt_number of Array.from(Array(20).keys())) {
        attempt = attempt_number + 1;
        const data = await clientFetcher<VerifyGasDepositResponse>(
          `/api/verify/gas?pool=${pool}`
        );

        if (data.response === 200) {
          break;
        }
        await sleep(5000);
      }

      if (attempt < 20) {
        setGasDepositState("verified");
        await sleep(5000);
        router.push("/dashboard");
      } else setGasDepositState("failed");
    }
  };

  const depositRewardButton = (
    <button
      onClick={verifyRewardDeposit}
      className="text-black bg-white rounded-md font-semibold px-4 text-sm p-2 capitalize"
    >
      {rewardDepositState === "pending"
        ? `I have deposited ${rewardBalance} ${tokenSymbol}`
        : rewardDepositState === "verifying"
          ? `${rewardDepositState}...`
          : rewardDepositState}
    </button>
  );

  const depositGasButton = (
    <button
      onClick={verifyGasDeposit}
      className="text-black bg-white rounded-md font-semibold px-4 text-sm p-2 capitalize"
    >
      {gasDepositState === "pending"
        ? `I have deposited ${stakingPoolGasEth} ETH`
        : gasDepositState === "verifying"
          ? `${gasDepositState}...`
          : gasDepositState}
    </button>
  );

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

      <strong>
        Only transfer tokens and ETH from the wallet you are signed in with
        (address shown above). Otherwise it will result in loss of funds.
      </strong>

      <span className="flex gap-1 items-center">
        <Copy value={pool} />
        <h6 className="hidden md:block p-2 bg-gray-800 rounded-md">{pool}</h6>

        <h6 className="md:hidden p-2 bg-gray-800 rounded-md">
          {shortenEthAddress(pool || "", 14)}
        </h6>
      </span>

      <div className="flex flex-col gap-4">
        <ShowWhen
          component={depositRewardButton}
          when={!poolData.rewardsDepositTxn}
        />

        <ShowWhen component={depositGasButton} when={!poolData.gasDepositTxn} />
      </div>
    </Modal>
  );
}
