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

export const useGetWishlistPosts = (wishlistId: string) => {
  const { wishlist_post, posts, posts_claimed } = useSupabaseClient();

  return useQuery(
    GET_WISHLIST_POSTS_KEY.query(wishlistId),
    async () => {
      const result = await wishlist_post
        .select('*')
        .eq('wishlistId', wishlistId);

      if (!result.data) return [];

      const { data: postsData } = await posts.select('*').in(
        'id',
        result.data.map((post) => post.postId)
      );

      const { data: postsClaimedData } = await posts_claimed
        .select('*')
        .in('postId', postsData?.map((post) => post.id) ?? []);

      return (
        postsData?.map<WishlistPost>((post) => ({
          ...post,
          id: post?.id ?? '',
          created_at: post?.created_at ?? '',
          created_by: post?.created_by ?? '',
          description: post?.description ?? '',
          name: post?.name ?? '',
          price: post?.price ?? '',
          url: post?.url ?? '',
          claimed_by:
            postsClaimedData
              ?.filter((postClaimed) => postClaimed.postId === post.id)
              .map(({ userId }) => ({ id: userId })) ?? [],
        })) ?? []
      );
    },
    { enabled: !!wishlistId, keepPreviousData: true }
  );
};
