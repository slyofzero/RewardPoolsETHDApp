import { db } from "@/firebase";
import { ApiResponseTemplate, StoredPool } from "@/types";
import { firebaseCollectionPrefix } from "@/utils/constants";
import type { NextApiRequest, NextApiResponse } from "next";

export interface PoolsData extends ApiResponseTemplate {
  data?: {
    pools: StoredPool[];
    lastVisible: string | null;
    pages: number;
  };
}

let totalPoolsCache: number | null = null;
let lastCacheTime: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000;

export default async function pools(
  req: NextApiRequest,
  res: NextApiResponse<PoolsData>
) {
  try {
    const method = req.method;

    switch (method) {
      case "GET": {
        const { lastVisibleId, name, token } = req.query || {};
        const pageSize = Number(req.query.pageSize || 6);

        const namePrefix = String(name);
        const endName = namePrefix.replace(/.$/, (c) =>
          String.fromCharCode(c.charCodeAt(0) + 1)
        );

        const collectionName = `pools${firebaseCollectionPrefix}`;

        let query = db
          .collection(collectionName)
          .limit(pageSize)
          .orderBy("closesAt");

        if (token) {
          query = query.where("token", "==", token);
        } else if (name) {
          query = query
            .where("name", ">=", namePrefix)
            .where("name", "<", endName)
            .orderBy("name");
        }

        // If lastVisibleId is present, start the query after the last document
        if (lastVisibleId) {
          const lastVisibleDocSnapshot = await db
            .collection(collectionName)
            .doc(String(lastVisibleId))
            .get();
          query = query.startAfter(lastVisibleDocSnapshot);
        }

        const querySnapshot = await query.get();

        const pools = querySnapshot.docs.map((doc) =>
          doc.data()
        ) as StoredPool[];

        // Check if there are documents before accessing lastVisible
        let lastVisible = null;
        if (querySnapshot.docs.length > 0) {
          lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1].id;
        }

        // Use cached total pools count if available and not expired
        const currentTime = Date.now();

        if (
          !totalPoolsCache ||
          !lastCacheTime ||
          currentTime - lastCacheTime > CACHE_DURATION
        ) {
          const totalSnapshot = await db.collection(collectionName).get();
          totalPoolsCache = totalSnapshot.docs.length;
          lastCacheTime = currentTime; // Update cache timestamp
        }

        const pages = Math.ceil(totalPoolsCache / pageSize);

        return res.status(200).json({
          message: "Pools fetched successfully.",
          data: { pools, lastVisible, pages },
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
      .json({ message: "There was an error in fetching pools." });
  }
}
