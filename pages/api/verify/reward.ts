import { getDocument, updateDocumentById } from "@/firebase";
import { etherScanProvider } from "@/rpc";
import {
  ApiResponseTemplate,
  StoredPool,
  TokenTransactionHistory,
} from "@/types";
import { apiFetcher } from "@/utils/api";
import { decodeJWT } from "@/utils/auth";
import { validVerificationTime } from "@/utils/constants";
import { getSecondsElapsed } from "@/utils/time";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export interface VerifyRewardDepositResponse extends ApiResponseTemplate {
  hash?: string;
}

export default async function verifyRewardDeposit(
  req: NextApiRequest,
  res: NextApiResponse<VerifyRewardDepositResponse>
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

        const rewardBalance = parseFloat(
          (poolData.size * (poolData.reward / 100)).toFixed(6)
        );

        const txnUrl = etherScanProvider.getUrl("account", {
          action: "tokentx",
          contractaddress: poolData.token,
          address: pool,
          startblock: "0",
          endblock: "99999999",
          page: "1",
          offset: "10",
          sort: "desc",
          apikey: process.env.ETHERSCAN_API_KEY,
        });

        const { data } = await apiFetcher<TokenTransactionHistory>(txnUrl);
        const txnList = data.result;

        // Verifying if a txn has happened in the past 5 minutes.
        for (const txn of txnList) {
          const { to, from, value, hash, timeStamp, tokenDecimal } = txn;

          if (to !== pool.toLowerCase()) continue;
          else if (from !== address.toLowerCase()) continue;

          if (getSecondsElapsed(timeStamp) > validVerificationTime) continue;

          const sentTokensAmount = parseFloat(
            parseFloat(ethers.formatUnits(value, Number(tokenDecimal))).toFixed(
              4
            )
          );

          if (sentTokensAmount !== rewardBalance) continue;

          const updates: Partial<StoredPool> = { rewardsDepositTxn: hash };
          if (poolData.gasDepositTxn) {
            updates["status"] = "ACTIVE";
          }

          updateDocumentById<StoredPool>({
            collectionName: "pools",
            id: poolData.id || "",
            updates,
          });

          return res
            .status(200)
            .json({ message: "Pool reward deposit verified", hash });
        }

        return res
          .status(400)
          .json({ message: "Pool reward deposit transaction not found" });
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
      message: "There was an error in verifying pool reward deposit.",
    });
  }
}
