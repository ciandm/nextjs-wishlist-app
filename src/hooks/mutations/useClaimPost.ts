import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { useUser } from '@supabase/auth-helpers-react';
import { GET_USERS_CLAIMED_POSTS_KEY } from 'src/hooks/queries/useGetUsersClaimedPosts';
import {
  GET_WISHLIST_POSTS_KEY,
  WishlistPost,
} from 'hooks/queries/useGetWishlistPosts';
import { updatePostInQueryData } from 'utils/queries';

export type ClaimPostInput = {
  postId: string;
};

export const useClaimPost = ({ wishlistId }: { wishlistId: string }) => {
  const { posts_claimed } = useSupabaseClient();
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation(
    async ({ postId }: ClaimPostInput) => {
      await posts_claimed.insert({ postId, userId: user?.id ?? '' });
    },
    {
      onSuccess: (_, { postId }) => {
        const post = queryClient
          .getQueryData<WishlistPost[]>(
            GET_WISHLIST_POSTS_KEY.query(wishlistId)
          )
          ?.find((post) => post.id === postId);

        if (post) {
          updatePostInQueryData({
            wishlistId,
            post: {
              ...post,
              claimed_by: [...post?.claimed_by, { id: user?.id ?? '' }],
            },
            queryClient,
          });
        }

        queryClient.setQueryData<{ wishlistId: string; posts: string[] }[]>(
          GET_USERS_CLAIMED_POSTS_KEY.query(user?.id ?? ''),
          (oldData) => {
            if (oldData?.find((data) => data.wishlistId === wishlistId)) {
              return oldData?.map((_data) => {
                if (_data.wishlistId === wishlistId) {
                  return {
                    wishlistId: _data.wishlistId,
                    posts: [..._data.posts, postId],
                  };
                }
                return _data;
              });
            }
            console.log('out here');
            return [...(oldData ?? []), { wishlistId, posts: [postId] }];
          }
        );

        queryClient.setQueryData<WishlistPost[]>(
          GET_WISHLIST_POSTS_KEY.query(wishlistId ?? ''),
          (oldData) => {
            return oldData?.map((data) => {
              if (data.id === postId) {
                return {
                  ...data,
                  claimed_by: [...data?.claimed_by, { id: user?.id ?? '' }],
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
