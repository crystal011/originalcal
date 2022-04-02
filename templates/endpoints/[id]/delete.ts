import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@calcom/prisma";

import { withMiddleware } from "@lib/helpers/withMiddleware";
import type { BaseResponse } from "@lib/types";
import {
  schemaQueryIdParseInt,
  withValidQueryIdTransformParseInt,
} from "@lib/validations/shared/queryIdTransformParseInt";

/**
 * @swagger
 * /api/resources/{id}/delete:
 *   delete:
 *     summary: Remove an existing resource
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the resource to delete
 *     tags:
 *     - resources
 *     responses:
 *       201:
 *         description: OK, resource removed successfuly
 *         model: Resource
 *       400:
 *        description: Bad request. Resource id is invalid.
 *       401:
 *        description: Authorization information is missing or invalid.
 */
export async function deleteResource(req: NextApiRequest, res: NextApiResponse<BaseResponse>) {
  const safe = await schemaQueryIdParseInt.safeParse(req.query);
  if (!safe.success) throw new Error("Invalid request query", safe.error);

  const data = await prisma.resource.delete({ where: { id: safe.data.id } });

  if (data) res.status(200).json({ message: `Resource with id: ${safe.data.id} deleted successfully` });
  else
    (error: Error) =>
      res.status(400).json({
        message: `Resource with id: ${safe.data.id} was not able to be processed`,
        error,
      });
}

export default withMiddleware("HTTP_DELETE")(withValidQueryIdTransformParseInt(deleteResource));
