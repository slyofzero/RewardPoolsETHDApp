import { ApiResponseTemplate } from "@/types";
import { decodeJWT } from "@/utils/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export interface SignedInUserData extends ApiResponseTemplate {
  address?: string;
}

export default async function signedInUser(
  req: NextApiRequest,
  res: NextApiResponse<SignedInUserData>
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
        return res.status(200).json({
          message: "Found valid user.",
          address,
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
      .json({ message: "There was an error in fetching signed in wallet." });
  }
}
