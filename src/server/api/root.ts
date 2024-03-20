import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/users";
import { adminRouter } from "./routers/admin";
import { miscRouter } from "./routers/misc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  admin: adminRouter,
  misc: miscRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
