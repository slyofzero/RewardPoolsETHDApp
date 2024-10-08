import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Modal } from ".";
import { maxStakingPercentage } from "@/utils/constants";
import { Copy } from "../Common";
import { shortenEthAddress } from "@/utils/web3";
import { useUser } from "@/state";
import { clientFetcher } from "@/utils/api";
import { sleep } from "@/utils/time";
import { useRouter } from "next/router";
import { VerifyRewardDepositResponse } from "@/pages/api/verify/reward";
import { StoredPool } from "@/types";
import { classNames } from "@/utils";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  poolData: StoredPool;
}

type VerificationState = "verifying" | "failed" | "verified" | "pending";

export function StakingModal({ setShowModal, poolData }: Props) {
  const [rewardDepositState, setRewardDepositState] =
    useState<VerificationState>("pending");

  const router = useRouter();
  const { user } = useUser();
  const [stakeAmount, setStakeAmount] = useState<number>();

  const { size, pool, tokenSymbol, staked } = poolData;
  const maxStaking = Math.min(size * maxStakingPercentage, size - staked);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > maxStaking) setStakeAmount(maxStaking);
    else setStakeAmount(value);
  };

  const verifyStakeDeposit = async () => {
    if (
      Number(stakeAmount) > 0 &&
      (rewardDepositState === "pending" || rewardDepositState === "failed")
    ) {
      setRewardDepositState("verifying");
      let attempt = 0;

      for (const attempt_number of Array.from(Array(20).keys())) {
        attempt = attempt_number + 1;
        const data = await clientFetcher<VerifyRewardDepositResponse>(
          `/api/verify/stake?pool=${pool}&amount=${stakeAmount}`
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

  return (
    <Modal
      className="p-4 flex flex-col gap-8 text-base text-center justify-center"
      setShowModal={setShowModal}
    >
      <div className="flex gap-4 items-center w-full">
        <input
          onChange={onChange}
          type="number"
          className="bg-black rounded-md border-[1.5px] outline-none p-2 placeholder:text-white/75 mx-auto flex-grow"
          placeholder={`Enter the amount of ${tokenSymbol} you want to stake`}
          value={stakeAmount}
        />

        <button
          onClick={() => setStakeAmount(maxStaking)}
          className="underline underline-offset-4"
        >
          Max
        </button>
      </div>

      <h6>
        Send the amount of tokens you want to stake to the pool address below.
        Be sure to send the tokens and click on the verify button with{" "}
        <strong>10 minutes</strong>. If the token transaction is older than
        that, it won&apos;t be considered valid. Your tokens should be sent from
        the <strong>same wallet</strong> you are signed in with, otherwise the
        transaction won&apos;t be considered valid.
      </h6>

      <strong>Invalid transaction will result in loss of funds.</strong>

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

      <button
        onClick={verifyStakeDeposit}
        className={classNames(
          "text-black rounded-md font-semibold px-4 text-sm p-2 capitalize",
          Number(stakeAmount) > 0 ? "bg-white" : "bg-gray-600 cursor-default"
        )}
      >
        {rewardDepositState === "pending"
          ? `Stake ${stakeAmount || 0} ${tokenSymbol}`
          : rewardDepositState === "verifying"
            ? `${rewardDepositState}...`
            : rewardDepositState}
      </button>
    </Modal>
  );
}
