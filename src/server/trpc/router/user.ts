import { t } from "../trpc";
import { z } from "zod";
import { prisma } from "../../db/client";

export const userRouter = t.router({
  getUserById: t.procedure.input(z.string().min(1)).query(async ({ input }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: input,
      },
    });

    return user;
  }),
});
