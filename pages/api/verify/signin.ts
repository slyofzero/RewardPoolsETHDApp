import { addDocument, getDocument, updateDocumentById } from "@/firebase";
import { etherScanProvider } from "@/rpc";
import { ApiResponseTemplate, StoredAccount } from "@/types";
import { TransactionHistory } from "@/types/transactions";
import { apiFetcher } from "@/utils/api";
import { createToken } from "@/utils/auth";
import { validVerificationTime, verificationAmount } from "@/utils/constants";
import { getSecondsElapsed } from "@/utils/time";
import { ethers } from "ethers";
import { Timestamp } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export interface VerifySignInResponse extends ApiResponseTemplate {
  hash?: string;
  token?: string;
}

export default async function verifySignin(
  req: NextApiRequest,
  res: NextApiResponse<VerifySignInResponse>
) {
  try {
    const method = req.method;
    const paymentWallet = process.env.NEXT_PUBLIC_VERIFICATION_ADDRESS;

    switch (method) {
      case "GET": {
        const address = req.query.address as string;

        const txnUrl = etherScanProvider.getUrl("account", {
          action: "txlist",
          address: String(paymentWallet),
          startblock: "0",
          endblock: "99999999",
          page: "1",
          offset: "10",
          sort: "desc",
          apikey: process.env.ETHERSCAN_API_KEY,
        });

        const { data } = await apiFetcher<TransactionHistory>(txnUrl);
        const txnList = data.result;

        // Verifying if a txn has happened in the past 5 minutes.
        for (const txn of txnList) {
          const { to, from, value, hash, timeStamp } = txn;

          if (to !== paymentWallet.toLowerCase()) continue;
          else if (from !== address.toLowerCase()) continue;

          if (getSecondsElapsed(timeStamp) > validVerificationTime) continue;

          const etherValue = parseFloat(
            parseFloat(ethers.formatEther(value)).toFixed(4)
          );

          if (etherValue !== verificationAmount) continue;

          const [userData] = await getDocument<StoredAccount>({
            collectionName: "users",
            queries: [["address", "==", address]],
          });

          if (userData) {
            updateDocumentById<StoredAccount>({
              collectionName: "users",
              id: userData.id || "",
              updates: {
                verificationTxn: hash,
              },
            });
          } else {
            addDocument<StoredAccount>({
              collectionName: "users",
              data: {
                address,
                createdOn: Timestamp.now(),
                verificationTxn: hash,
              },
            });
          }

          // Generate JWT token
          const token = createToken(address);

          return res
            .status(200)
            .json({ message: "Wallet verified", hash, token });
        }

        return res
          .status(400)
          .json({ message: "Verification transaction not found" });
      }

      default: {
        return res.status(405).json({ message: "Method not allowed." });
      }
    }
  } catch (err) {
    const error = err as Error;
    // eslint-disable-next-line
    console.error(error.message, error.stack);

    return res
      .status(500)
      .json({ message: "There was an error in wallet registration." });
  }
}
