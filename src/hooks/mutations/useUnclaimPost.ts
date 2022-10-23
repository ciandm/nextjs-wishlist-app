import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { ClaimPostInput } from './useClaimPost';
import {
  GET_WISHLIST_POSTS_KEY,
  WishlistPost,
} from 'src/hooks/queries/useGetWishlistPosts';
import { GET_USERS_CLAIMED_POSTS_KEY } from 'src/hooks/queries/useGetUsersClaimedPosts';
import { useGetUser } from 'src/hooks/queries/useGetUser';
import { updatePostInQueryData } from 'utils/queries';

export const useUnclaimPost = ({ wishlist_id }: { wishlist_id: string }) => {
  const { posts_claimed } = useSupabaseClient();
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  return useMutation(
    async ({ post_id }: ClaimPostInput) => {
      await posts_claimed.delete().eq('post_id', post_id);
    },
    {
      onSuccess: (_, { post_id }) => {
        queryClient.setQueryData<{ wishlist_id: string; posts: string[] }[]>(
          GET_USERS_CLAIMED_POSTS_KEY.query(user?.id ?? ''),
          (oldData) => {
            if (
              oldData?.find(({ wishlist_id }) => wishlist_id === wishlist_id)
            ) {
              return oldData
                ?.map((data) => {
                  if (data.wishlist_id === wishlist_id) {
                    const newPosts = data.posts.filter(
                      (post) => post !== post_id
                    );
                    return {
                      wishlist_id: data.wishlist_id,
                      posts: newPosts,
                    };
                  }
                  return data;
                })
                .filter((data) => data.posts.length > 0);
            }
          }
        );

        queryClient.setQueryData<WishlistPost[]>(
          GET_WISHLIST_POSTS_KEY.query(wishlist_id ?? ''),
          (oldData) => {
            return oldData?.map((data) => {
              if (data.id === post_id) {
                return {
                  ...data,
                  claimed_by: data.claimed_by.filter(
                    (user) => user.id !== user?.id
                  ),
                };
              }
              return data;
            });
          }
        );
      },
    }
  );
};
