import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';

export const GET_WISHLIST_KEY = {
  base: { name: 'GET_WISHLIST' },
  query: (id: string) => [{ ...GET_WISHLIST_KEY.base, id }],
};

export const useGetWishlist = (wishlist_id: string) => {
  const { wishlists } = useSupabaseClient();

  return useQuery(
    GET_WISHLIST_KEY.query(wishlist_id),
    async () => {
      const result = await wishlists.select('*').eq('id', wishlist_id);

      return result.data?.[0];
    },
    { enabled: !!wishlist_id }
  );
};
