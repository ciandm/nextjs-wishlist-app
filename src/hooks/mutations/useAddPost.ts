import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { GET_WISHLIST_POSTS_KEY } from 'src/hooks/queries/useGetWishlistPosts';
import { useGetUser } from 'src/hooks/queries/useGetUser';
import { Post } from 'types/utils';
import { addPostToQueryData } from 'utils/queries';

export type AddPostInput = Pick<
  Post,
  'name' | 'url' | 'description' | 'price' | 'is_favorited'
> & {
  wishlistId: string;
};

export const useAddPost = () => {
  const { posts, user_post, wishlist_post } = useSupabaseClient();
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  return useMutation(
    async ({
      wishlistId,
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
        userId: user?.id ?? '',
        postId: post?.[0]?.id ?? '',
      });

      await wishlist_post.insert({
        wishlistId: wishlistId,
        postId: post?.[0]?.id ?? '',
      });

      return post?.[0];
    },
    {
      onSuccess: (post, { wishlistId }) => {
        addPostToQueryData({ post, wishlistId, queryClient });
      },
    }
  );
};
