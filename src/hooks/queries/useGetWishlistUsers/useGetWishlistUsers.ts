import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';

export const GET_WISHLIST_USERS_KEY = {
  base: { name: 'GET_WISHLIST_USERS' },
  query: (id: string) => [{ ...GET_WISHLIST_USERS_KEY.base, id }],
};

export const useGetWishlistUsers = (wishlistId: string) => {
  const { user_wishlist, users } = useSupabaseClient();
  return useQuery(
    GET_WISHLIST_USERS_KEY.query(wishlistId),
    async () => {
      const { data: usersForWishlist } = await user_wishlist
        .select('*')
        .eq('wishlistId', wishlistId);

      if (!usersForWishlist) return [];

      const { data: usersData } = await users.select('*').in(
        'id',
        usersForWishlist.map((user) => user.userId)
      );

      return (
        usersData?.map((user) => ({
          id: user.id ?? '',
          name: user.name ?? '',
          email: user.email ?? '',
        })) ?? []
      );
    },
    { enabled: !!wishlistId }
  );
};
