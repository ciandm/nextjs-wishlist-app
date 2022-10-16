import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import {
  GET_WISHLIST_POSTS_KEY,
  WishlistPost,
} from 'src/hooks/queries/useGetWishlistPosts';
import { updatePostInQueryData } from 'utils/queries';

export type ClaimPostInput = {
  postId: string;
  isPurchased: boolean;
};

export const useMarkAsPurchased = ({ wishlistId }: { wishlistId: string }) => {
  const { posts } = useSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ postId, isPurchased }: ClaimPostInput) => {
      const { data } = await posts
        .update({ is_purchased: isPurchased })
        .eq('id', postId)
        .select();

      return data?.[0];
    },
    {
      onSuccess: (post) => {
        updatePostInQueryData({ wishlistId, post, queryClient });
      },
    }
  );
};
