import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { useUser } from '@supabase/auth-helpers-react';
import uniq from 'lodash/uniq';

export const GET_USERS_CLAIMED_POSTS_KEY = {
  base: { name: 'GET_USERS_CLAIMED_POSTS' },
  query: (id: string) => [{ ...GET_USERS_CLAIMED_POSTS_KEY.base, id }],
};

export const useGetUsersClaimedPosts = () => {
  const { posts_claimed, posts } = useSupabaseClient();
  const user = useUser();

  return useQuery(
    GET_USERS_CLAIMED_POSTS_KEY.query(user?.id ?? ''),
    async () => {
      const { data: usersClaimedPosts } = await posts_claimed
        .select('*')
        .eq('user_id', user?.id ?? '');

      const { data: wishlistPosts } = await posts
        .select('*')
        .in('id', usersClaimedPosts?.map((post) => post.post_id) ?? []);

      const uniqueWishlistIds = uniq(
        wishlistPosts?.map((post) => post.wishlist_id) ?? []
      );

      return uniqueWishlistIds.map((id) => ({
        wishlist_id: id,
        posts:
          wishlistPosts
            ?.filter((post) => post.wishlist_id === id)
            .map((post) => post.id) ?? [],
      }));
    },
    { enabled: !!user?.id }
  );
};
