import type { NextApiRequest } from "next";

import { HttpError } from "@calcom/lib/http-error";
import { defaultResponder } from "@calcom/lib/server";

import { isAdminGuard } from "@lib/utils/isAdmin";
import { schemaQueryUserId } from "@lib/validations/shared/queryUserId";

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove an existing user
 *     operationId: removeUserById
 *     parameters:
 *      - in: path
 *        name: id
 *        example: 1
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID of the user to delete
 *     tags:
 *     - users
 *     responses:
 *       201:
 *         description: OK, user removed successfuly
 *       400:
 *        description: Bad request. User id is invalid.
 *       401:
 *        description: Authorization information is missing or invalid.
 */
export async function deleteHandler(req: NextApiRequest) {
  const { prisma } = req;
  const query = schemaQueryUserId.parse(req.query);
  const isAdmin = await isAdminGuard(req.userId, req.prisma);
  // Here we only check for ownership of the user if the user is not admin, otherwise we let ADMIN's edit any user
  if (!isAdmin && query.userId !== req.userId)
    throw new HttpError({ statusCode: 401, message: "Unauthorized" });

  const user = await prisma.user.findUnique({ where: { id: query.userId } });
  if (!user) throw new HttpError({ statusCode: 404, message: "User not found" });

  await prisma.user.delete({ where: { id: user.id } });
  return { message: `User with id: ${user.id} deleted successfully` };
}

export default defaultResponder(deleteHandler);
