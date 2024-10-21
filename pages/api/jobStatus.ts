import { apiFetcher } from "@/utils/api";
import { SCRIPT_URL } from "@/utils/env";
import type { NextApiRequest, NextApiResponse } from "next";

interface ScriptJobStatusApiResponse {
  status: "Completed" | "Failed" | "Pending";
  txn?: string;
}

export interface JobStatusApiResponse
  extends Partial<ScriptJobStatusApiResponse> {
  message: string;
}

export default async function getUserLoans(
  req: NextApiRequest,
  res: NextApiResponse<JobStatusApiResponse>
) {
  const method = req.method;

  if (method === "GET") {
    try {
      const { jobId } = req.query;

      const { response, data } = await apiFetcher<ScriptJobStatusApiResponse>(
        `${SCRIPT_URL}/jobStatus?jobId=${jobId}`
      );

      return res
        .status(response)
        .json({ message: `Data for jobId ${jobId}`, ...data });
    } catch (error) {
      // eslint-disable-next-line
      console.error("Error getting job status:", error);
      return res.status(500).json({
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  } else {
    return res.status(405).json({
      message: "API method not allowed",
    });
  }
}
