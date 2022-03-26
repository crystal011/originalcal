import prisma from "@calcom/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

import { schemaQueryId, withValidQueryIdTransformParseInt } from "@lib/validations/queryIdTransformParseInt";


type ResponseData = {
  message?: string;
  error?: unknown;
};

export async function team(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { query, method } = req;
  const safe = await schemaQueryId.safeParse(query);
  if (safe.success) {
    if (method === "DELETE") {
      // DELETE WILL DELETE THE EVENT TYPE
      prisma.team
        .delete({ where: { id: safe.data.id } })
        .then(() => {
          // We only remove the team type from the database if there's an existing resource.
          res.status(200).json({ message: `team-type with id: ${safe.data.id} deleted successfully` });
        })
        .catch((error) => {
          // This catches the error thrown by prisma.team.delete() if the resource is not found.
          res.status(400).json({ message: `Resource with id:${safe.data.id} was not found`, error: error });
        });
    } else {
      // Reject any other HTTP method than POST
      res.status(405).json({ message: "Only DELETE Method allowed in /team-types/[id]/delete endpoint" });
    }
  }
}

export default withValidQueryIdTransformParseInt(team);
