import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { DatabaseInsertValues, Wishlist } from 'types/utils';
import { useUser } from '@supabase/auth-helpers-react';
import { GET_WISHLISTS_BY_USER_ID_KEY } from 'src/hooks/queries/useGetWishlistsByUserId/useGetWishlistsByUserId';

type CreateWishlistInput = Pick<DatabaseInsertValues<'wishlists'>, 'name'> & {
  users?: { email: string }[];
};

export const useCreateWishlist = () => {
  const queryClient = useQueryClient();
  const { users, wishlists, user_wishlist } = useSupabaseClient();
  const user = useUser();

  return useMutation(
    async ({ name, users: passedUsers = [] }: CreateWishlistInput) => {
      console.log('--- [useCreateWishlist] creating wishlist');
      const { data: usersData, count } = await users
        .select('*', {
          count: 'exact',
        })
        .in(
          'email',
          passedUsers.map((user) => user.email)
        );

      if (count !== passedUsers?.length) {
        throw new Error("One or more users don't exist");
      }

      const result = await wishlists
        .insert({ name, created_by: user?.id })
        .select();

      if (!result) throw new Error('Failed to create wishlist');

      const wishlistData = result?.data?.[0];

      await user_wishlist.insert(
        usersData?.map((user) => ({
          user_id: user.id,
          wishlist_id: wishlistData?.id ?? '',
        })) ?? []
      );

      return wishlistData;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData<Wishlist[]>(
          GET_WISHLISTS_BY_USER_ID_KEY.query(user?.id ?? ''),
          (oldData) => {
            if (!data) {
              return oldData;
            }
            return [...(oldData ?? []), { ...data }];
          }
        );
      },
    }
  );
};
