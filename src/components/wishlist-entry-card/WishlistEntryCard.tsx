import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Icon,
  IconButton,
  Tooltip,
  Text,
  Flex,
  Button,
  Skeleton,
  Heading,
} from '@chakra-ui/react';
import { IoTrashBin } from 'react-icons/io5';
import { WishlistDeleteConfirmPrompt } from '../wishlist-delete-confirm-prompt/WishlistDeleteConfirmPrompt';
import { useGetWishlistUsers } from 'src/hooks/queries/useGetWishlistUsers/useGetWishlistUsers';
import { WishlistUsers } from 'src/components/wishlist-users/WishlistUsers';
import { useGetWishlistPosts } from 'hooks/queries/useGetWishlistPosts';
import { useGetUsersClaimedPosts } from 'hooks/queries/useGetUsersClaimedPosts';
import { useUser } from '@supabase/auth-helpers-react';

interface WishlistEntryCardProps {
  name?: string;
  id?: string;
  isAdmin?: boolean;
  isLoading?: boolean;
}

export const WishlistEntryCard = ({
  name,
  isAdmin,
  id,
  isLoading,
}: WishlistEntryCardProps) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const user = useUser();
  const { data: usersInWishlist = [] } = useGetWishlistUsers(id ?? '');
  const { data: wishlistPosts = [] } = useGetWishlistPosts(id ?? '');
  const { data: wishlistsWithPostsClaimedByUser } = useGetUsersClaimedPosts();

  const postsClaimedByUser =
    wishlistsWithPostsClaimedByUser?.find((w) => w.wishlist_id === id)?.posts ??
    [];

  const otherPostsCount = wishlistPosts.filter(
    (post) => post.user_id !== user?.id
  ).length;

  const userPostsCount = wishlistPosts?.length - otherPostsCount;

  return (
    <>
      <Flex
        flexDirection="column"
        backgroundColor="white"
        width="full"
        border="1px"
        borderColor="gray.300"
        borderRadius={8}
        overflow="hidden"
      >
        <Flex p={4} justifyContent="space-between">
          <Flex mr={4} gap={1} flexDirection="column" alignItems="flex-start">
            <Skeleton noOfLines={1} isLoaded={!isLoading} minW={32}>
              <Heading
                fontSize="md"
                fontWeight="medium"
                color="gray.800"
                noOfLines={1}
                overflow="hidden"
                textOverflow="ellipsis"
                as="h2"
                mb={1}
              >
                {name ? name : 'Loading...'}
              </Heading>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Text fontSize="sm" color="gray.500">
                {wishlistPosts?.length} post{wishlistPosts?.length !== 1 && 's'}{' '}
                total
              </Text>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                {userPostsCount} post{wishlistPosts?.length !== 1 && 's'} by you
              </Text>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                {postsClaimedByUser?.length} post
                {wishlistPosts?.length !== 1 && 's'} claimed by you
              </Text>
            </Skeleton>
          </Flex>
          <Skeleton isLoaded={!isLoading} alignSelf="flex-start">
            <NextLink href={`/wishlist/${id}`} passHref>
              <Button
                alignSelf="flex-start"
                mt={1}
                fontSize="sm"
                variant="link"
                colorScheme="blue"
                as="a"
              >
                View
              </Button>
            </NextLink>
          </Skeleton>
        </Flex>
        <Flex
          flex={1}
          alignItems="center"
          justifyContent="space-between"
          py={2}
          px={4}
          bg="gray.100"
        >
          <Skeleton isLoaded={!isLoading}>
            <Flex alignItems="center" gap={2}>
              <WishlistUsers size="sm" users={usersInWishlist} />
              <Text>{usersInWishlist.length} users</Text>
            </Flex>
          </Skeleton>
          <Flex gap={2} alignItems="center">
            {isAdmin && (
              <Tooltip flexShrink={0} label="Delete wishlist">
                <IconButton
                  minH={10}
                  ml={2}
                  aria-label="Delete wishlist"
                  variant="link"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  <Icon as={IoTrashBin} />
                </IconButton>
              </Tooltip>
            )}
          </Flex>
        </Flex>
      </Flex>
      <WishlistDeleteConfirmPrompt
        isOpen={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onClose={() => setIsDeleteConfirmOpen(false)}
        wishlist_id={id ?? ''}
      />
    </>
  );
};
