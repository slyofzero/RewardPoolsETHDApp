import { getDocumentById } from "@/firebase";
import { ApiResponseTemplate, StoredPool } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

export interface PoolData extends ApiResponseTemplate {
  pool?: StoredPool;
}

export default async function pools(
  req: NextApiRequest,
  res: NextApiResponse<PoolData>
) {
  try {
    const method = req.method;

    switch (method) {
      case "GET": {
        const id = String(req.query.id);

        const pool = await getDocumentById<StoredPool>({
          collectionName: "pools",
          id,
        });

        if (pool) {
          return res.status(200).json({
            message: "Pool fetched successfully.",
            pool: { id, ...pool },
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
