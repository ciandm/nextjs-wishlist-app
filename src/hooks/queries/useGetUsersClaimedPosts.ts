import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { useGetUser } from 'src/hooks/queries/useGetUser';
import uniq from 'lodash/uniq';

export const GET_USERS_CLAIMED_POSTS_KEY = {
  base: { name: 'GET_USERS_CLAIMED_POSTS' },
  query: (id: string) => [{ ...GET_USERS_CLAIMED_POSTS_KEY.base, id }],
};

export const useGetUsersClaimedPosts = () => {
  const { posts_claimed, wishlist_post } = useSupabaseClient();
  const { data: user } = useGetUser();

  return useQuery(
    GET_USERS_CLAIMED_POSTS_KEY.query(user?.id ?? ''),
    async () => {
      const { data: usersClaimedPosts } = await posts_claimed
        .select('*')
        .eq('userId', user?.id ?? '');

      const { data: wishlistPosts } = await wishlist_post
        .select('*')
        .in('postId', usersClaimedPosts?.map((post) => post.postId) ?? []);

      const uniqueWishlistIds = uniq(
        wishlistPosts?.map((post) => post.wishlistId) ?? []
      );

      return uniqueWishlistIds.map((id) => ({
        wishlistId: id,
        posts:
          wishlistPosts
            ?.filter((post) => post.wishlistId === id)
            .map((post) => post.postId) ?? [],
      }));
    },
    { enabled: !!user?.id }
  );
};
