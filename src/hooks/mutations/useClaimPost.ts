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
  post_id: string;
};

export const useClaimPost = ({ wishlist_id }: { wishlist_id: string }) => {
  const { posts_claimed, posts } = useSupabaseClient();
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation(
    async ({ post_id }: ClaimPostInput) => {
      const postResponse = await posts
        .select('*', { count: 'exact' })
        .eq('id', post_id);

      if (!postResponse.data) {
        throw new Error('That post does not exist');
      }
      await posts_claimed.insert({ post_id, user_id: user?.id ?? '' });
    },
    {
      onError: () => {
        queryClient.invalidateQueries(
          GET_WISHLIST_POSTS_KEY.query(wishlist_id)
        );
      },
      onSuccess: (_, { post_id }) => {
        const post = queryClient
          .getQueryData<WishlistPost[]>(
            GET_WISHLIST_POSTS_KEY.query(wishlist_id)
          )
          ?.find((post) => post.id === post_id);

        if (post) {
          updatePostInQueryData({
            wishlist_id,
            post: {
              ...post,
              claimed_by: [...post?.claimed_by, { id: user?.id ?? '' }],
            },
            queryClient,
          });
        }

        queryClient.setQueryData<{ wishlist_id: string; posts: string[] }[]>(
          GET_USERS_CLAIMED_POSTS_KEY.query(user?.id ?? ''),
          (oldData) => {
            if (oldData?.find((data) => data.wishlist_id === wishlist_id)) {
              return oldData?.map((_data) => {
                if (_data.wishlist_id === wishlist_id) {
                  return {
                    wishlist_id: _data.wishlist_id,
                    posts: [..._data.posts, post_id],
                  };
                }
                return _data;
              });
            }
            return [...(oldData ?? []), { wishlist_id, posts: [post_id] }];
          }
        );

        queryClient.setQueryData<WishlistPost[]>(
          GET_WISHLIST_POSTS_KEY.query(wishlist_id ?? ''),
          (oldData) => {
            return oldData?.map((data) => {
              if (data.id === post_id) {
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
