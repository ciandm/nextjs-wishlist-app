// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { wishlistRouter } from "./wishlist";

export const appRouter = t.router({
  auth: authRouter,
  user: userRouter,
  wishlist: wishlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
