import { PrismaClient, EventType } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { schemaQueryId, withValidQueryId } from "@lib/validations/queryIdTransformParseInt";

const prisma = new PrismaClient();

type ResponseData = {
  data?: EventType;
  message?: string;
  error?: unknown;
};

export async function eventType(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { query, method } = req;
  const safe = await schemaQueryId.safeParse(query);
  if (safe.success) {
    if (method === "GET") {
      const event = await prisma.eventType.findUnique({ where: { id: safe.data.id } });

      if (event) res.status(200).json({ data: event });
      if (!event) res.status(404).json({ message: "Event type not found" });
    } else {
      // Reject any other HTTP method than POST
      res.status(405).json({ message: "Only GET Method allowed" });
    }
  }
}


export default withValidQueryId(eventType);
