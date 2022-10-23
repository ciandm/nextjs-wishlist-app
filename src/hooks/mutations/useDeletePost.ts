import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { GET_WISHLIST_POSTS_KEY } from 'src/hooks/queries/useGetWishlistPosts';

type DeletePostInput = {
  post_id: string;
  wishlist_id: string;
};

export const useDeletePost = () => {
  const { posts, user_post, wishlist_post, posts_claimed } =
    useSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, DeletePostInput>(
    async ({ post_id }) => {
      await user_post.delete().eq('post_id', post_id);
      await wishlist_post.delete().eq('post_id', post_id);
      await posts_claimed.delete().eq('post_id', post_id);
      await posts.delete().eq('id', post_id);
    },
    {
      onSuccess: (_, { wishlist_id }) => {
        queryClient.invalidateQueries(
          GET_WISHLIST_POSTS_KEY.query(wishlist_id)
        );
      },
    }
  );
};
