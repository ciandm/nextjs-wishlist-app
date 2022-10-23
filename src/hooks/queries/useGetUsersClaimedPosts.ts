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
        .eq('user_id', user?.id ?? '');

      const { data: wishlistPosts } = await wishlist_post
        .select('*')
        .in('post_id', usersClaimedPosts?.map((post) => post.post_id) ?? []);

      const uniquewishlist_ids = uniq(
        wishlistPosts?.map((post) => post.wishlist_id) ?? []
      );

      return uniquewishlist_ids.map((id) => ({
        wishlist_id: id,
        posts:
          wishlistPosts
            ?.filter((post) => post.wishlist_id === id)
            .map((post) => post.post_id) ?? [],
      }));
    },
    { enabled: !!user?.id }
  );
};
