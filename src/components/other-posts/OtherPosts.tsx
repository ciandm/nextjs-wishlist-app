import { useGetWishlistPosts } from 'hooks/queries/useGetWishlistPosts';
import React from 'react';
import { WishlistPost } from 'src/components/wishlist-post/WishlistPost';
import { Box, chakra, Text } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { PostFilterOptions } from 'components/post-filter-options/PostFilterOptions';

export type StatusFilterType = 'claimed' | 'unclaimed' | 'claimed-by-user';

export const OtherPosts = ({ wishlist_id }: { wishlist_id: string }) => {
  const user = useUser();
  const { data: posts = [] } = useGetWishlistPosts(wishlist_id);

  const [statusFilter, setStatusFilter] = React.useState<
    StatusFilterType | undefined
  >(undefined);
  const [userFilter, setUserFilter] = React.useState<string | undefined>(
    undefined
  );

  const filteredPosts = posts
    .filter((post) => post.user_id !== user?.id)
    .filter((post) => (userFilter ? post.user_id === userFilter : post))
    .filter((post) => {
      switch (statusFilter) {
        case 'claimed':
          return post.claimed_by.length > 0;
        case 'unclaimed':
          return post.claimed_by.length === 0;
        case 'claimed-by-user':
          return post.claimed_by
            .map((user) => user.id)
            .includes(user?.id ?? '');
        default:
          return post;
      }
    });

  const handleSetStatusFilter = (statusFilter?: StatusFilterType) => {
    setStatusFilter(statusFilter);
  };

  const handleSetUserFilter = (userFilter?: string) => {
    setUserFilter(userFilter);
  };

  return (
    <chakra.div display="flex" flexDirection="column" gap={4}>
      <PostFilterOptions
        wishlist_id={wishlist_id}
        onSetUserFilter={handleSetUserFilter}
        onSetStatusFilter={handleSetStatusFilter}
        userFilter={userFilter}
        statusFilter={statusFilter}
      />
      {filteredPosts?.length > 0 ? (
        <Box
          display={['flex', null, filteredPosts?.length > 1 ? 'grid' : 'flex']}
          flexWrap="wrap"
          gap={4}
          gridTemplateColumns={[
            null,
            null,
            filteredPosts?.length > 1 ? '1fr 1fr' : null,
          ]}
        >
          {filteredPosts.map((post) => (
            <WishlistPost key={post.id} {...post} wishlist_id={wishlist_id} />
          ))}
        </Box>
      ) : (
        <Text textAlign="center">There are no posts to show.</Text>
      )}
    </chakra.div>
  );
};
