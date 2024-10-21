import { getDocument, getDocumentById } from "@/firebase";
import { ApiResponseTemplate, StoredPool, StoredRewards } from "@/types";
import { decodeJWT } from "@/utils/auth";
import { getTokenBalance, getTokenDetails } from "@/utils/web3";
import type { NextApiRequest, NextApiResponse } from "next";

export interface ClaimData {
  canClaim: boolean;
  holding: number;
  reward: number;
}

export interface PoolData extends ApiResponseTemplate {
  pool?: StoredPool;
  claimData?: ClaimData;
}

export default async function pools(
  req: NextApiRequest,
  res: NextApiResponse<PoolData>
) {
  try {
    const method = req.method;
    const address = decodeJWT(req);

    switch (method) {
      case "GET": {
        const id = String(req.query.id);

        const pool = await getDocumentById<StoredPool>({
          collectionName: "pools",
          id,
        });

        if (pool) {
          let claimData = { canClaim: false, holding: 0, reward: 0 };

          if (address) {
            const [tokenData, addressBalance] = await Promise.all([
              getTokenDetails(pool.token),
              getTokenBalance(address, pool.token),
            ]);
            const holding =
              (addressBalance / (tokenData?.totalSupply || 0)) * 100;

            let rewardPercentage = holding / (pool.maxClaim / 100);
            rewardPercentage = rewardPercentage > 100 ? 100 : rewardPercentage;

            let reward = (rewardPercentage / 100) * pool.size;
            reward =
              reward > pool.size - pool.claimed
                ? pool.size - pool.claimed
                : reward;

            claimData = { canClaim: true, holding, reward };
          }

          const userRewardClaim = await getDocument<StoredRewards>({
            collectionName: "rewards",
            queries: [
              ["pool", "==", id],
              ["user", "==", address],
            ],
          });

          if (userRewardClaim.length > 0) {
            claimData.canClaim = false;
          }

          return res.status(200).json({
            message: "Pool fetched successfully.",
            pool: { id, ...pool },
            claimData,
          });
        } else {
          return res.status(404).json({
            message: `Pool ID ${id} not found.`,
          });
        }
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
      .json({ message: "There was an error in fetching pools." });
  }
}
