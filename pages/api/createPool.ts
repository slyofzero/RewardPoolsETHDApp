import { CreatePoolData } from "@/components";
import { addDocument } from "@/firebase";
import { ApiResponseTemplate, StoredPool } from "@/types";
import { decodeJWT } from "@/utils/auth";
import { encrypt } from "@/utils/cryptography";
import { getTokenDetails } from "@/utils/web3";
import { ethers } from "ethers";
import { Timestamp } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export interface CreatePoolResponse extends ApiResponseTemplate {
  data?: StoredPool;
}

export default async function createPool(
  req: NextApiRequest,
  res: NextApiResponse<CreatePoolResponse>
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
      case "POST": {
        const body = JSON.parse(req.body) as CreatePoolData;

        body.size = Number(body.size);

        const {
          duration,
          // eslint-disable-next-line
          tokenSymbol: _tokenSymbol,
          // eslint-disable-next-line
          pool: _pool,
          ...restBody
        } = body;

        const pool = ethers.Wallet.createRandom();
        const currentTimeStamp = Timestamp.now();
        const durationInSeconds = duration * 60 * 60 * 24;
        const closesAt = new Timestamp(
          currentTimeStamp.seconds + durationInSeconds,
          currentTimeStamp.nanoseconds
        );

        const tokenDetails = await getTokenDetails(body.token);

        if (!tokenDetails)
          return res.status(404).json({
            message: `Couldn't find the ${body.token} on the chain as an ERC20 token`,
          });

        const { symbol, name } = tokenDetails;

        const poolData = await addDocument<StoredPool>({
          collectionName: "pools",
          data: {
            ...restBody,
            pool: pool.address,
            mnemonicPhrase: encrypt(pool.mnemonic?.phrase || ""),
            claimed: 0,
            tokenName: name,
            tokenSymbol: symbol,
            status: "PENDING",
            createdOn: Timestamp.now(),
            creator: address,
            closesAt,
          },
        });

        return res.status(200).json({
          message: `New pool ${pool.address} created`,
          data: poolData,
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
      .json({ message: "There was an error in creating a pool." });
  }
}
