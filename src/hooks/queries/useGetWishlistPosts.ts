import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { Post } from 'types/utils';

export type WishlistPost = Post & {
  claimed_by: {
    id: string;
  }[];
};

export const GET_WISHLIST_POSTS_KEY = {
  base: { name: 'GET_WISHLIST_POSTS' },
  query: (id: string) => [{ ...GET_WISHLIST_POSTS_KEY.base, id }],
};

export const useGetWishlistPosts = (wishlist_id: string) => {
  const { posts, posts_claimed } = useSupabaseClient();

  return useQuery(
    GET_WISHLIST_POSTS_KEY.query(wishlist_id),
    async () => {
      const postsResponse = await posts
        .select('*')
        .eq('wishlist_id', wishlist_id);

      if (postsResponse.error) {
        throw new Error(postsResponse.error.message);
      }

      const postsClaimedResponse = await posts_claimed
        .select('*')
        .in('post_id', postsResponse.data?.map((post) => post.id) ?? []);

      if (postsClaimedResponse.error) {
        throw new Error(postsClaimedResponse.error.message);
      }

      return (
        postsResponse.data?.map<WishlistPost>((post) => ({
          ...post,
          id: post?.id ?? '',
          created_at: post?.created_at ?? '',
          user_id: post?.user_id ?? '',
          description: post?.description ?? '',
          name: post?.name ?? '',
          price: post?.price ?? '',
          url: post?.url ?? '',
          wishlist_id: post?.wishlist_id ?? '',
          is_favorited: post?.is_favorited ?? false,
          is_purchased: post?.is_purchased ?? false,
          claimed_by:
            postsClaimedResponse.data
              ?.filter((postClaimed) => postClaimed.post_id === post.id)
              .map(({ user_id }) => ({ id: user_id })) ?? [],
        })) ?? []
      );
    },
    { enabled: !!wishlist_id, keepPreviousData: true }
  );
};
