import { getDocument, updateDocumentById } from "@/firebase";
import { etherScanProvider } from "@/rpc";
import { ApiResponseTemplate, StoredPool, TransactionHistory } from "@/types";
import { apiFetcher } from "@/utils/api";
import { decodeJWT } from "@/utils/auth";
import { stakingPoolGasEth, validVerificationTime } from "@/utils/constants";
import { getSecondsElapsed } from "@/utils/time";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export interface VerifyGasDepositResponse extends ApiResponseTemplate {
  hash?: string;
}

export default async function verifyRewardDeposit(
  req: NextApiRequest,
  res: NextApiResponse<VerifyGasDepositResponse>
) {
  try {
    const method = req.method;
    const address = decodeJWT(req);

    if (!address) {
      return res
        .status(401)
        .json({ message: "Please sign in to view this page." });
    }

    switch (method) {
      case "GET": {
        const pool = String(req.query.pool);
        const [poolData] = await getDocument<StoredPool>({
          collectionName: "pools",
          queries: [["pool", "==", pool]],
        });

        if (!poolData) {
          return res
            .status(404)
            .json({ message: `Couldn't find pool ${pool}` });
        }

        const txnUrl = etherScanProvider.getUrl("account", {
          action: "txlist",
          address: pool,
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

          if (to !== pool.toLowerCase()) continue;
          else if (from !== address.toLowerCase()) continue;

          if (getSecondsElapsed(timeStamp) > validVerificationTime) continue;

          const etherValue = parseFloat(
            parseFloat(ethers.formatEther(value)).toFixed(4)
          );

          if (etherValue !== stakingPoolGasEth) continue;

          const updates: Partial<StoredPool> = { gasDepositTxn: hash };
          if (poolData.rewardsDepositTxn) {
            updates["status"] = "ACTIVE";
          }

          updateDocumentById<StoredPool>({
            collectionName: "pools",
            id: poolData.id || "",
            updates,
          });

          return res
            .status(200)
            .json({ message: "Pool gas fee deposit verified", hash });
        }

        return res
          .status(400)
          .json({ message: "Pool gas fee deposit transaction not found" });
      }

      default: {
        return res.status(405).json({ message: "Method not allowed." });
      }
    }
  } catch (err) {
    const error = err as Error;
    // eslint-disable-next-line
    console.error(error.message, error.stack);

    return res.status(500).json({
      message: "There was an error in verifying pool gas fee deposit.",
    });
  }
}
