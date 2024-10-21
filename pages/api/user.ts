import { getDocument } from "@/firebase";
import {
  ApiResponseTemplate,
  StoredAccount,
  StoredPool,
  StoredRewards,
} from "@/types";
import { decodeJWT } from "@/utils/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export interface UserActivityData {
  user: StoredAccount;
  pools: StoredPool[];
  rewards: StoredRewards[];
}

export interface UserData extends ApiResponseTemplate {
  data?: UserActivityData;
}

export default async function user(
  req: NextApiRequest,
  res: NextApiResponse<UserData>
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
        const [user] = await getDocument<StoredAccount>({
          collectionName: "users",
          queries: [["address", "==", address]],
        });

        if (user) {
          const [pools, rewards] = await Promise.all([
            getDocument<StoredPool>({
              collectionName: "pools",
              queries: [["creator", "==", address]],
            }),
            getDocument<StoredRewards>({
              collectionName: "rewards",
              queries: [["user", "==", address]],
            }),
          ]);

          return res.status(200).json({
            message: "Fetched user data successfully.",
            data: {
              user,
              pools,
              rewards,
            },
          });
        }

        return res.status(404).json({
          message: "This wallet is not registered.",
        });
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
      .json({ message: "There was an error in getting user data." });
  }
}
