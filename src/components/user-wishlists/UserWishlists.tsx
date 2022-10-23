import React from 'react';
import { WishlistEntryCard } from 'components/wishlist-entry-card/WishlistEntryCard';
import { useUser } from '@supabase/auth-helpers-react';
import { useGetWishlistsByUserId } from 'src/hooks/queries/useGetWishlistsByUserId/useGetWishlistsByUserId';
import { Box, Flex, Skeleton, Text } from '@chakra-ui/react';
import { CreateWishlistForm } from 'src/components/create-wishlist-form/CreateWishlistForm';
import emptyWishlists from 'public/images/empty-wishlists.svg';
import { EmptyState } from 'components/empty-state/EmptyState';
import { Wishlist } from 'types/utils';

export const UserWishlists = () => {
  const user = useUser();
  const {
    data: wishlists = [],
    isLoading: isLoadingWishlist,
    isFetching: isFetchingWishlist,
    status,
  } = useGetWishlistsByUserId();
  const name = user?.user_metadata.name;

  const _wishlists = (
    isLoadingWishlist ? Array(3).fill(null) : wishlists
  ) as Wishlist[];

  const hasNoWishlists = wishlists.length === 0 && status === 'success';

  return (
    <Flex
      pb={[16, 0]}
      px={[4, 4, 0]}
      pt={4}
      flex={1}
      flexDirection="column"
      gap={4}
    >
      <Skeleton isLoaded={!isLoadingWishlist}>
        <CreateWishlistForm />
      </Skeleton>
      {!hasNoWishlists && !isFetchingWishlist && (
        <Text fontSize="xl" fontWeight="medium">
          Hi {name}, here are your wishlists:
        </Text>
      )}
      <Box
        display={['flex', null, 'grid']}
        flexWrap="wrap"
        gap={4}
        gridTemplateColumns={[null, null, '1fr 1fr']}
      >
        {_wishlists?.map((wishlist, index) => (
          <WishlistEntryCard
            key={wishlist?.id ?? index}
            name={wishlist?.name ?? ''}
            isAdmin={
              isLoadingWishlist ? false : !!(wishlist?.user_id === user?.id)
            }
            id={wishlist?.id}
            isLoading={isLoadingWishlist}
          />
        ))}
      </Box>
      {hasNoWishlists && !isFetchingWishlist && (
        <EmptyState
          mt={4}
          src={emptyWishlists}
          title="Looks empty here"
          description="You are not in any wishlists yet. When you are, they will
                    appear here. You can create a wishlist by clicking the button
                    above."
        />
      )}
    </Flex>
  );
};
