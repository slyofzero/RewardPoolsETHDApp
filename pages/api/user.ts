import { getDocument } from "@/firebase";
import { ApiResponseTemplate, StoredAccount } from "@/types";
import { decodeJWT } from "@/utils/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export interface UserData extends ApiResponseTemplate {
  data?: StoredAccount;
}

export default async function address(
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
        const [account] = await getDocument<StoredAccount>({
          collectionName: "users",
          queries: [["address", "==", address]],
        });

        if (account) {
          return res.status(200).json({
            message: "A new wallet was registered successfully.",
            data: account,
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
      .json({ message: "There was an error in wallet registration." });
  }
}
