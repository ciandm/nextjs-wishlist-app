import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { useGetUser } from 'src/hooks/queries/useGetUser';

export const GET_WISHLISTS_BY_USER_ID_KEY = {
  base: { name: 'GET_WISHLISTS_BY_USER_ID' },
  query: (id: string) => [{ ...GET_WISHLISTS_BY_USER_ID_KEY.base, id }],
};

export const useGetWishlistsByUserId = () => {
  const { user_wishlist, wishlists } = useSupabaseClient();
  const { data: user } = useGetUser();

  return useQuery(
    GET_WISHLISTS_BY_USER_ID_KEY.query(user?.id ?? ''),
    async () => {
      const { data: wishlistsById } = await user_wishlist
        .select('*')
        .eq('userId', user?.id);

      if (!wishlistsById) return [];

      const { data: wishlistsData } = await wishlists.select('*').in(
        'id',
        wishlistsById.map((wishlist) => wishlist.wishlistId)
      );

      return wishlistsData ?? [];
    },
    { enabled: !!user?.id ?? '' }
  );
};
