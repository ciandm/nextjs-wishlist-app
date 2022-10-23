import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { useGetUser } from 'src/hooks/queries/useGetUser';
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
  const { data: user } = useGetUser();

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
          created_by: user?.id ?? '',
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
