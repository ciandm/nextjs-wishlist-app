import { trpc } from "@/utils/trpc";

export const useGetWishlistsById = (id: string) => {
  return trpc.wishlist.getAllByUserId.useQuery(
    { userId: id ?? "" },
    { enabled: !!id, refetchOnWindowFocus: false }
  );
};
