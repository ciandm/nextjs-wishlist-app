import { t } from "../trpc";
import { z } from "zod";
import { prisma } from "../../db/client";

export const wishlistRouter = t.router({
  getAllByUserId: t.procedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      const userWishlistsById = await prisma.userWishlist.findMany({
        where: {
          userId: input.userId,
        },
      });

      const wishlists = await prisma.wishlist.findMany({
        where: {
          id: {
            in: userWishlistsById.map((uw) => uw.wishlistId),
          },
        },
      });

      return wishlists;
    }),
  retrieveAllUsers: t.procedure
    .input(z.object({ wishlistId: z.string().min(1) }))
    .query(async ({ input }) => {
      const userWishlistsById = await prisma.userWishlist.findMany({
        where: {
          wishlistId: input.wishlistId,
        },
      });

      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userWishlistsById.map((uw) => uw.userId),
          },
        },
      });

      return users;
    }),
  deleteWishlist: t.procedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async (req) => {
      const deleteUsers = prisma.userWishlist.deleteMany({
        where: {
          wishlistId: req.input.id,
        },
      });

      const deletePosts = prisma.post.deleteMany({
        where: {
          wishlistId: req.input.id,
        },
      });

      const deleteWishlist = prisma.wishlist.delete({
        where: {
          id: req.input.id,
        },
      });

      await prisma.$transaction([deleteUsers, deletePosts, deleteWishlist]);
    }),
  createWishlist: t.procedure
    .input(z.object({ name: z.string(), userId: z.string() }))
    .mutation(async (req) => {
      return await prisma.wishlist.create({
        data: {
          name: req.input.name,
          users: {
            create: [{ userId: req.input.userId }],
          },
          createdBy: req.input.userId,
          posts: {
            create: [],
          },
        },
        include: {
          users: true,
          posts: true,
        },
      });
    }),
});
