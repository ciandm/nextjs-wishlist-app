import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { DatabaseInsertValues } from 'types/utils';
import { useUser } from '@supabase/auth-helpers-react';
import { GET_WISHLISTS_BY_USER_ID_KEY } from 'src/hooks/queries/useGetWishlistsByUserId/useGetWishlistsByUserId';

type CreateWishlistInput = Pick<DatabaseInsertValues<'wishlists'>, 'name'> & {
  users?: { id: string }[];
};

export const useCreateWishlist = () => {
  const queryClient = useQueryClient();
  const { wishlists, user_wishlist } = useSupabaseClient();
  const user = useUser();

  return useMutation<unknown, unknown, CreateWishlistInput>(
    async ({ name, users }) => {
      const result = await wishlists
        .insert({ name, created_by: user?.id })
        .select();

      if (!result) throw new Error('Failed to create wishlist');

      const wishlistData = result?.data?.[0];

      await user_wishlist.insert(
        users?.map((user) => ({
          userId: user.id,
          wishlistId: wishlistData?.id ?? '',
        })) ?? []
      );
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
