import { ApiResponseTemplate } from "@/types";
import { apiPoster } from "@/utils/api";
import { decodeJWT } from "@/utils/auth";
import { SCRIPT_URL } from "@/utils/env";
import type { NextApiRequest, NextApiResponse } from "next";

interface ScriptSendRewardResponse {
  message: string;
  jobId: string;
}

export interface SendRewardData extends ApiResponseTemplate {
  jobId?: string;
}

export default async function pools(
  req: NextApiRequest,
  res: NextApiResponse<SendRewardData>
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
        const pool = String(req.query.pool);

        const response = await apiPoster<ScriptSendRewardResponse>(
          `${SCRIPT_URL}/sendReward`,
          {
            pool,
            address,
          },
          // @ts-ignore
          { "Content-Type": "application/json" }
        );

        return res
          .status(200)
          .json({ message: "Job scheduled", jobId: response.data.jobId });
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
