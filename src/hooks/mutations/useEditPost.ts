import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { Post } from 'types/utils';
import { updatePostInQueryData } from 'utils/queries';

export type AddPostInput = Pick<
  Post,
  'id' | 'url' | 'name' | 'description' | 'price' | 'is_favorited'
> & {
  wishlist_id: string;
};

export const useEditPost = () => {
  const { posts } = useSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      id,
      url,
      name,
      description,
      price,
      is_favorited = false,
    }: AddPostInput) => {
      const { data } = await posts
        .update({
          name,
          price,
          url,
          description,
          is_favorited,
        })
        .eq('id', id)
        .select();

      return data?.[0];
    },
    {
      onSuccess: (post, { wishlist_id }) => {
        updatePostInQueryData({ wishlist_id, post, queryClient });
      },
    }
  );
};
