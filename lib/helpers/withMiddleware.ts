import { label } from "next-api-middleware";

import { addRequestId } from "./addRequestid";
import { captureErrors } from "./captureErrors";
import { customPrismaClient } from "./customPrisma";
import { extendRequest } from "./extendRequest";
import {
  HTTP_POST,
  HTTP_DELETE,
  HTTP_PATCH,
  HTTP_GET,
  HTTP_GET_OR_POST,
  HTTP_GET_DELETE_PATCH,
} from "./httpMethods";
import { verifyApiKey } from "./verifyApiKey";

const withMiddleware = label(
  {
    HTTP_GET_OR_POST,
    HTTP_GET_DELETE_PATCH,
    HTTP_GET,
    HTTP_PATCH,
    HTTP_POST,
    HTTP_DELETE,
    addRequestId,
    verifyApiKey,
    customPrismaClient,
    extendRequest,
    sentry: captureErrors,
  },
  // The order here, determines the order of execution, put customPrismaClient before verifyApiKey always.
  ["sentry", "customPrismaClient", "verifyApiKey", "addRequestId", "extendRequest"] // <-- Provide a list of middleware to call automatically
);

export { withMiddleware };
