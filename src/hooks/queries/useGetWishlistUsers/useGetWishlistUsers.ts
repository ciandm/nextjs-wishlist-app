import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';

export const GET_WISHLIST_USERS_KEY = {
  base: { name: 'GET_WISHLIST_USERS' },
  query: (id: string) => [{ ...GET_WISHLIST_USERS_KEY.base, id }],
};

export const useGetWishlistUsers = (wishlist_id: string) => {
  const { user_wishlist, users } = useSupabaseClient();
  return useQuery(
    GET_WISHLIST_USERS_KEY.query(wishlist_id),
    async () => {
      const { data: usersForWishlist } = await user_wishlist
        .select('*')
        .eq('wishlist_id', wishlist_id);

      if (!usersForWishlist) return [];

      const { data: usersData } = await users.select('*').in(
        'id',
        usersForWishlist.map((user) => user.user_id)
      );

      return (
        usersData?.map((user) => ({
          id: user.id ?? '',
          name: user.name ?? '',
          email: user.email ?? '',
        })) ?? []
      );
    },
    { enabled: !!wishlist_id }
  );
};
