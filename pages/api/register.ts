import { addDocument } from "@/firebase";
import { ApiResponseTemplate, StoredAccount } from "@/types";
import { encrypt } from "@/utils/cryptography";
import { ethers } from "ethers";
import { Timestamp } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export interface RegisterApiResponse extends ApiResponseTemplate {
  address?: string;
  phrase?: string;
}

export default function register(
  req: NextApiRequest,
  res: NextApiResponse<RegisterApiResponse>
) {
  try {
    const method = req.method;

    switch (method) {
      case "POST": {
        const wallet = ethers.Wallet.createRandom();

        const address = wallet.address;
        const phrase = wallet.mnemonic?.phrase || "";

        addDocument<StoredAccount>({
          collectionName: "accounts",
          id: address,
          data: {
            address,
            phrase: encrypt(phrase),
            registerdOn: Timestamp.now(),
            signedIn: false,
          },
        });

        return res.status(200).json({
          message: "A new wallet was registered successfully.",
          address: address,
          phrase: phrase,
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
