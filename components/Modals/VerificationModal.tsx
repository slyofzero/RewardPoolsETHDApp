import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from ".";
import { JWTKeyName, verificationAmount } from "@/utils/constants";
import { Copy } from "../Common";
import { shortenEthAddress } from "@/utils/web3";
import { clientFetcher } from "@/utils/api";
import { sleep } from "@/utils/time";
import { VerifySignInResponse } from "@/pages/api/verify/signin";
import { useUser } from "@/state";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  address: string;
}

type VerificationState = "verifying" | "failed" | "verified" | "pending";

export function VerificationModal({ setShowModal, address }: Props) {
  const [verificationState, setVerificationState] =
    useState<VerificationState>("pending");
  const paymentWallet = process.env.NEXT_PUBLIC_VERIFICATION_ADDRESS;

  const { setUser } = useUser();

  const verifySignIn = async () => {
    if (verificationState === "pending" || verificationState === "failed") {
      setVerificationState("verifying");

      let attempt = 0;

      for (const attempt_number of Array.from(Array(20).keys())) {
        attempt = attempt_number + 1;
        const data = await clientFetcher<VerifySignInResponse>(
          `/api/verify/signin?address=${address}`
        );

        if (data.response === 200) {
          const { data: verificationData } = data;
          localStorage.setItem(JWTKeyName, verificationData.token || "");
          setUser(address);
          break;
        }
        await sleep(5000);
      }

      if (attempt < 20) {
        setVerificationState("verified");
        await sleep(5000);
        setShowModal(false);
      } else setVerificationState("failed");
    }
  };

  return (
    <Modal
      className="p-4 flex flex-col gap-8 text-base text-center justify-center"
      setShowModal={setShowModal}
    >
      <h6>
        To verify your signin, please transfer {verificationAmount}ETH to the
        below address, for the wallet address you just entered.
      </h6>

      <span className="flex gap-1 whitespace-nowrap items-center mx-auto">
        Your Wallet - {shortenEthAddress(address, 10)}
      </span>

      <span className="flex gap-1 items-center">
        <Copy value={paymentWallet} />
        <h6 className="hidden md:block p-2 bg-gray-800 rounded-md">
          {paymentWallet}
        </h6>

        <h6 className="md:hidden p-2 bg-gray-800 rounded-md">
          {shortenEthAddress(paymentWallet, 14)}
        </h6>
      </span>

      <button
        onClick={verifySignIn}
        className="text-black bg-white rounded-md font-semibold px-4 text-sm p-2 capitalize"
      >
        {verificationState === "pending"
          ? "Check verification"
          : verificationState === "verifying"
            ? `${verificationState}...`
            : verificationState === "verified"
              ? "Verified Successfully"
              : verificationState}
      </button>
    </Modal>
  );
}
