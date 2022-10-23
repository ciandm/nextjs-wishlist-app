import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { useUser } from '@supabase/auth-helpers-react';
import { Post } from 'types/utils';
import { addPostToQueryData } from 'utils/queries';
import { useToast } from 'hooks/useToast';

export type AddPostInput = Pick<
  Post,
  'name' | 'url' | 'description' | 'price' | 'is_favorited'
> & {
  wishlist_id: string;
};

export const useAddPost = () => {
  const { posts } = useSupabaseClient();
  const queryClient = useQueryClient();
  const user = useUser();
  const toast = useToast();

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
          wishlist_id,
          name,
          price,
          url,
          description,
          user_id: user?.id ?? '',
          is_favorited,
          is_purchased: false,
        })
        .select();

      if (!post) {
        throw new Error('Failed to create post');
      }

      return post?.[0];
    },
    {
      onSuccess: (post, { wishlist_id }) => {
        addPostToQueryData({ post, wishlist_id, queryClient });
      },
      onError: () => {
        toast({
          title: 'Something went wrong adding your post',
          description: 'Please try again',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );
};
