import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { updatePostInQueryData } from 'utils/queries';

export type ClaimPostInput = {
  post_id: string;
  isPurchased: boolean;
};

export const useMarkAsPurchased = ({
  wishlist_id,
}: {
  wishlist_id: string;
}) => {
  const { posts } = useSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ post_id, isPurchased }: ClaimPostInput) => {
      const { data } = await posts
        .update({ is_purchased: isPurchased })
        .eq('id', post_id)
        .select();

      return data?.[0];
    },
    {
      onSuccess: (post) => {
        updatePostInQueryData({ wishlist_id, post, queryClient });
      },
    }
  );
};
