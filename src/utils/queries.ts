import { QueryClient } from '@tanstack/react-query';
import {
  GET_WISHLIST_POSTS_KEY,
  WishlistPost,
} from 'hooks/queries/useGetWishlistPosts';
import { Post, Wishlist } from 'types/utils';

type PostInQueryData = Omit<WishlistPost, 'claimed_by'> & {
  claimed_by?: { id: string }[];
};

export function updatePostInQueryData({
  wishlistId,
  post,
  queryClient,
}: {
  wishlistId: string;
  post?: PostInQueryData;
  queryClient: QueryClient;
}) {
  if (!post) return;
  queryClient.setQueryData<WishlistPost[]>(
    GET_WISHLIST_POSTS_KEY.query(wishlistId),
    (oldData) => {
      const newData = [...(oldData as any)];
      const index = newData.findIndex((p) => p.id === post?.id);
      newData[index] = { ...newData[index], ...post };
      return newData;
    }
  );
}

export function addPostToQueryData({
  wishlistId,
  post,
  queryClient,
}: {
  wishlistId: string;
  post?: PostInQueryData;
  queryClient: QueryClient;
}) {
  if (!post) return;
  queryClient.setQueryData<WishlistPost[]>(
    GET_WISHLIST_POSTS_KEY.query(wishlistId),
    (oldData) => {
      return [...(oldData ?? []), { ...post, claimed_by: [] }];
    }
  );
}

export function removePostFromQueryData({
  wishlistId,
  post,
  queryClient,
}: {
  wishlistId: string;
  post?: PostInQueryData;
  queryClient: QueryClient;
}) {
  if (!post) return;

  queryClient.setQueryData<WishlistPost[]>(
    GET_WISHLIST_POSTS_KEY.query(wishlistId),
    (oldData) => {
      return oldData?.filter((p) => p.id !== post?.id);
    }
  );
}
