import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { GET_WISHLIST_POSTS_KEY } from 'src/hooks/queries/useGetWishlistPosts';

type DeletePostInput = {
  postId: string;
  wishlistId: string;
};

export const useDeletePost = () => {
  const { posts, user_post, wishlist_post, posts_claimed } =
    useSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, DeletePostInput>(
    async ({ postId }) => {
      await user_post.delete().eq('postId', postId);
      await wishlist_post.delete().eq('postId', postId);
      await posts_claimed.delete().eq('postId', postId);
      await posts.delete().eq('id', postId);
    },
    {
      onSuccess: (_, { wishlistId }) => {
        queryClient.invalidateQueries(GET_WISHLIST_POSTS_KEY.query(wishlistId));
      },
    }
  );
};
