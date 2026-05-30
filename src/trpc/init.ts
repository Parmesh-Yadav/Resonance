import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return {};
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// Authenticated procedure - call auth() only when needed
export const authProcedure = t.procedure.use(async ({ next }) => {
  const { userId } = await auth();

  if (!userId)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in to access this resource.",
    });

  return next({
    ctx: { userId },
  });
});

// Organization procedure - call auth() only when needed and check for organization membership
export const orgProcedure = t.procedure.use(async ({ next }) => {
  const { userId, orgId } = await auth();

  if (!userId)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in to access this resource.",
    });

  if (!orgId)
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "You must be a member of an organization to access this resource.",
    });

  return next({
    ctx: { userId, orgId },
  });
});
