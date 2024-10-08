import { addDocument, getDocument } from "@/firebase";
import { etherScanProvider } from "@/rpc";
import {
  ApiResponseTemplate,
  StoredPool,
  StoredStakes,
  TokenTransactionHistory,
} from "@/types";
import { apiFetcher } from "@/utils/api";
import { decodeJWT } from "@/utils/auth";
import { ethers } from "ethers";
import { Timestamp } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export interface VerifyStakeResponse extends ApiResponseTemplate {
  hash?: string;
}

export default async function verifyStake(
  req: NextApiRequest,
  res: NextApiResponse<VerifyStakeResponse>
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
        const stakeAmount = Number(req.query.amount);
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
          const { to, from, value, hash, tokenDecimal } = txn;

          if (to !== pool.toLowerCase()) continue;
          else if (from !== address.toLowerCase()) continue;

          // if (getSecondsElapsed(timeStamp) > validVerificationTime) continue;

          const sentTokensAmount = parseFloat(
            parseFloat(ethers.formatUnits(value, Number(tokenDecimal))).toFixed(
              4
            )
          );

          if (sentTokensAmount !== stakeAmount) continue;

          addDocument<StoredStakes>({
            collectionName: "stakes",
            data: {
              amount: stakeAmount,
              pool: poolData.id || "",
              stakedOn: Timestamp.now(),
              user: address,
            },
          });

          return res.status(200).json({ message: "User stake verified", hash });
        }

        return res
          .status(400)
          .json({ message: "User stake transaction not found" });
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
      message: "There was an error in verifying user stake.",
    });
  }
}
