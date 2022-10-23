import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { DatabaseInsertValues } from 'types/utils';
import { useUser } from '@supabase/auth-helpers-react';
import { GET_WISHLISTS_BY_USER_ID_KEY } from 'src/hooks/queries/useGetWishlistsByUserId/useGetWishlistsByUserId';

type DeleteWishlistInput = Pick<DatabaseInsertValues<'wishlists'>, 'id'>;

export const useDeleteWishlist = () => {
  const { wishlists, user_wishlist, posts } = useSupabaseClient();
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation<unknown, unknown, DeleteWishlistInput>(
    async ({ id }) => {
      const userWishlistResponse = await user_wishlist
        .delete()
        .eq('wishlist_id', id);

      if (userWishlistResponse.error) {
        throw new Error('Failed to delete wishlist - user_wishlist');
      }

      const wishlistPostResponse = await posts.delete().eq('wishlist_id', id);

      if (wishlistPostResponse.error) {
        throw new Error('Failed to delete wishlist - posts');
      }

      const wishlistResponse = await wishlists.delete().eq('id', id);

      if (wishlistResponse.error) {
        throw new Error('Failed to delete wishlist - wishlists');
      }

      return wishlistResponse.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          GET_WISHLISTS_BY_USER_ID_KEY.query(user?.id ?? '')
        );
      },
    }
  );
};
