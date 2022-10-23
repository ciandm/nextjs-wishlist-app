import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { useGetUser } from 'src/hooks/queries/useGetUser';
import { Post } from 'types/utils';
import { addPostToQueryData } from 'utils/queries';

export type AddPostInput = Pick<
  Post,
  'name' | 'url' | 'description' | 'price' | 'is_favorited'
> & {
  wishlist_id: string;
};

export const useAddPost = () => {
  const { posts, user_post, wishlist_post } = useSupabaseClient();
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  return useMutation(
    async ({
      wishlist_id,
      url,
      name,
      description,
      price,
      is_favorited = false,
    }: AddPostInput) => {
      const { data: post } = await posts
        .insert({
          name,
          price,
          url,
          description,
          created_by: user?.id ?? '',
          is_favorited,
        })
        .select();

      if (!post) {
        throw new Error('Failed to create post');
      }

      await user_post.insert({
        user_id: user?.id ?? '',
        post_id: post?.[0]?.id ?? '',
      });

      await wishlist_post.insert({
        wishlist_id: wishlist_id,
        post_id: post?.[0]?.id ?? '',
      });

      return post?.[0];
    },
    {
      onSuccess: (post, { wishlist_id }) => {
        addPostToQueryData({ post, wishlist_id, queryClient });
      },
    }
  );
};
