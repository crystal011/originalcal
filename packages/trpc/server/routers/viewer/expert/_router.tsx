import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ZUserInputSchema } from "./user.schema";

type expertRouterHandlerCache = {
  user?: typeof import("./user.handler").userHandler;
};

const UNSTABLE_HANDLER_CACHE: expertRouterHandlerCache = {};

export const expertRouter = router({
  user: authedProcedure.input(ZUserInputSchema).query(async ({ ctx, input }) => {
    if (!UNSTABLE_HANDLER_CACHE.user) {
      UNSTABLE_HANDLER_CACHE.user = await import("./user.handler").then((mod) => mod.userHandler);
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.user) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.user({
      ctx,
      input,
    });
  }),
});
