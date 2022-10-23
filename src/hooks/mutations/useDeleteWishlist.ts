import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { DatabaseInsertValues } from 'types/utils';
import { useUser } from '@supabase/auth-helpers-react';
import { GET_WISHLISTS_BY_USER_ID_KEY } from 'src/hooks/queries/useGetWishlistsByUserId/useGetWishlistsByUserId';

type DeleteWishlistInput = Pick<DatabaseInsertValues<'wishlists'>, 'id'>;

export const useDeleteWishlist = () => {
  const { wishlists, user_wishlist } = useSupabaseClient();
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation<unknown, unknown, DeleteWishlistInput>(
    async ({ id }) => {
      await user_wishlist.delete().eq('wishlist_id', id);
      return wishlists.delete().eq('id', id);
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
