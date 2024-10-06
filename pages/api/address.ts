import { getDocument } from "@/firebase";
import { ApiResponseTemplate, StoredAccount } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

export interface AddressData extends ApiResponseTemplate {
  data?: StoredAccount;
}

export default async function address(
  req: NextApiRequest,
  res: NextApiResponse<AddressData>
) {
  try {
    const method = req.method;

    switch (method) {
      case "GET": {
        const { address } = req.query;

        const [account] = await getDocument<StoredAccount>({
          collectionName: "accounts",
          queries: [["address", "==", address]],
        });

        if (account) {
          return res.status(200).json({
            message: "A new wallet was registered successfully.",
            data: account,
          });
        } else {
          return res.status(404).json({
            message: "This wallet is not registered.",
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
      .json({ message: "There was an error in wallet registration." });
  }
}
