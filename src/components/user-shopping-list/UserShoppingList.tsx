import React from 'react';
import { Text, Flex, Icon, Box } from '@chakra-ui/react';
import { WishlistPost } from 'components/wishlist-post/WishlistPost';
import { useGetWishlistsByUserId } from 'hooks/queries/useGetWishlistsByUserId/useGetWishlistsByUserId';
import { useGetWishlistPosts } from 'hooks/queries/useGetWishlistPosts';
import { useGetUser } from 'src/hooks/queries/useGetUser';
import { useGetWishlistsWithUserClaimedPosts } from 'hooks/queries/useGetWishlistsWithUserClaimedPosts';
import emptyShoppingList from 'public/images/empty-shopping-list.svg';
import NextLink from 'next/link';
import { useEffect } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { EmptyState } from 'components/empty-state/EmptyState';

export const UserShoppingList = ({
  setCount,
}: {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { data: usersWishlists } = useGetWishlistsByUserId();
  const { data: wishlistsWithPostsClaimedByUser } =
    useGetWishlistsWithUserClaimedPosts();

  useEffect(() => {
    setCount(
      wishlistsWithPostsClaimedByUser?.reduce(
        (acc, curr) => curr?.posts?.length + acc,
        0
      ) ?? 0
    );
  }, [wishlistsWithPostsClaimedByUser, setCount]);

  const validWishlists =
    usersWishlists?.filter((wishlist) =>
      wishlistsWithPostsClaimedByUser
        ?.map(({ wishlistId }) => wishlistId)
        .includes(wishlist.id)
    ) ?? [];

  if (validWishlists.length === 0) {
    return (
      <EmptyState
        title="Looks empty here"
        description="You have not claimed any posts yet. When you do, they will appear
            here."
        src={emptyShoppingList}
      />
    );
  }

  return (
    <Flex flexDirection="column" gap={4}>
      {validWishlists?.map(({ name = '', id }) => (
        <WishlistGroup key={id} name={name ?? ''} id={id} />
      ))}
    </Flex>
  );
};

const WishlistGroup = ({ id, name }: { id: string; name: string }) => {
  const { data: posts } = useGetWishlistPosts(id);
  const { data: user } = useGetUser();

  const usersClaimedPosts =
    posts?.filter((post) =>
      post.claimed_by.map(({ id }) => id).includes(user?.id ?? '')
    ) ?? [];

  const postsPurchasedCount = usersClaimedPosts?.filter(
    (post) => post.is_purchased
  ).length;

  return (
    <Flex flexDirection="column" gap={2}>
      <NextLink href={`/wishlist/${id}`} passHref>
        <Text
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          fontSize="lg"
          fontWeight="medium"
          color="gray.800"
          display="block"
          as="a"
          mb={2}
        >
          <Flex mb={1} justifyContent="space-between" alignItems="center">
            {name} <Icon as={IoChevronForward} />
          </Flex>
          <Text color="gray.500" fontSize="sm">
            {postsPurchasedCount} / {usersClaimedPosts?.length} purchased
          </Text>
        </Text>
      </NextLink>
      <Box
        display={[
          'flex',
          null,
          usersClaimedPosts?.length > 1 ? 'grid' : 'flex',
        ]}
        flexWrap="wrap"
        gap={4}
        gridTemplateColumns={[
          null,
          null,
          usersClaimedPosts?.length > 1 ? '1fr 1fr' : null,
        ]}
      >
        {usersClaimedPosts?.map((post) => (
          <WishlistPost
            isInShoppingList
            wishlistId={id}
            key={post.id}
            {...post}
          />
        ))}
      </Box>
    </Flex>
  );
};
