import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';

export const GET_WISHLIST_KEY = {
  base: { name: 'GET_WISHLIST' },
  query: (id: string) => [{ ...GET_WISHLIST_KEY.base, id }],
};

export const useGetWishlist = (wishlistId: string) => {
  const { wishlists } = useSupabaseClient();

  return useQuery(
    GET_WISHLIST_KEY.query(wishlistId),
    async () => {
      const result = await wishlists.select('*').eq('id', wishlistId);

      return result.data?.[0];
    },
    { enabled: !!wishlistId }
  );
};
