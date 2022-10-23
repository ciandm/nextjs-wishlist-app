import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { useUser } from '@supabase/auth-helpers-react';

export const GET_WISHLISTS_BY_USER_ID_KEY = {
  base: { name: 'GET_WISHLISTS_BY_USER_ID' },
  query: (id: string) => [{ ...GET_WISHLISTS_BY_USER_ID_KEY.base, id }],
};

export const useGetWishlistsByUserId = () => {
  const { user_wishlist, wishlists } = useSupabaseClient();
  const user = useUser();

  return useQuery(
    GET_WISHLISTS_BY_USER_ID_KEY.query(user?.id ?? ''),
    async () => {
      console.log('--- [useGetWishlistsByUserId] fetching');
      const { data: wishlistsById } = await user_wishlist
        .select('*')
        .eq('user_id', user?.id);

      if (!wishlistsById) return [];

      const { data: wishlistsData } = await wishlists.select('*').in(
        'id',
        wishlistsById.map((wishlist) => wishlist.wishlist_id)
      );

      console.log('--- [useGetWishlistsByUserId] fetched', wishlistsData);

      return wishlistsData ?? [];
    },
    {
      enabled: !!user?.id,
    }
  );
};
