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

export const useUnclaimPost = ({ wishlistId }: { wishlistId: string }) => {
  const { posts_claimed } = useSupabaseClient();
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  return useMutation(
    async ({ postId }: ClaimPostInput) => {
      await posts_claimed.delete().eq('postId', postId);
    },
    {
      onSuccess: (_, { postId }) => {
        queryClient.setQueryData<{ wishlistId: string; posts: string[] }[]>(
          GET_USERS_CLAIMED_POSTS_KEY.query(user?.id ?? ''),
          (oldData) => {
            if (oldData?.find(({ wishlistId }) => wishlistId === wishlistId)) {
              return oldData
                ?.map((data) => {
                  if (data.wishlistId === wishlistId) {
                    const newPosts = data.posts.filter(
                      (post) => post !== postId
                    );
                    return {
                      wishlistId: data.wishlistId,
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
          GET_WISHLIST_POSTS_KEY.query(wishlistId ?? ''),
          (oldData) => {
            return oldData?.map((data) => {
              if (data.id === postId) {
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
