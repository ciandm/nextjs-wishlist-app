import {
  Icon,
  Text,
  chakra,
  Link,
  Button,
  useToast,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';
import { WishlistUsers } from 'components/wishlist-users/WishlistUsers';
import React, { useState, useEffect } from 'react';
import {
  IoCheckmarkCircle,
  IoHandLeft,
  IoLink,
  IoRemoveCircle,
  IoStar,
  IoStarOutline,
} from 'react-icons/io5';
import { useGetWishlistUsers } from 'src/hooks/queries/useGetWishlistUsers/useGetWishlistUsers';
import { UserAvatar } from 'src/components/user-avatar/UserAvatar';
import { useGetUser } from 'src/hooks/queries/useGetUser';
import { useClaimPost } from 'src/hooks/mutations/useClaimPost';
import { useUnclaimPost } from 'src/hooks/mutations/useUnclaimPost';
import debounce from 'lodash/debounce';
import { Post } from 'types/utils';
import { PostDeleteConfirmPrompt } from 'components/post-delete-confirm-prompt/PostDeleteConfirmPrompt';
import { useMarkAsPurchased } from 'hooks/mutations/useMarkAsPurchased';

type PostProps = Post & {
  wishlistId: string;
  claimed_by?: { id: string }[];
  onEdit?: (
    data: Pick<Post, 'description' | 'price' | 'name' | 'url' | 'id'>
  ) => void;
  isLoading?: boolean;
  isInShoppingList?: boolean;
};

export const WishlistPost = ({
  is_favorited: isFavorited,
  description,
  id,
  name,
  price,
  url,
  created_by,
  wishlistId,
  claimed_by,
  onEdit,
  is_purchased: isPurchased,
  isLoading: isLoadingPost,
  isInShoppingList,
}: PostProps) => {
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const { data: user } = useGetUser();
  const { data: users } = useGetWishlistUsers(wishlistId);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast({ position: 'top' });

  const { mutate: handleClaimPost, isLoading: isLoadingClaimPost } =
    useClaimPost({ wishlistId });
  const { mutate: handleUnClaimPost, isLoading: isLoadingUnClaimPost } =
    useUnclaimPost({ wishlistId });
  const { mutate: handleMarkAsPurchased, isLoading: isLoadingMarkAsPurchased } =
    useMarkAsPurchased({ wishlistId });

  const createdByUser = users?.find((u) => u.id === created_by);

  const usersWhoHaveClaimed =
    users?.filter((u) => claimed_by?.some((c) => c.id === u.id)) ?? [];

  const isAuthor = createdByUser?.id === user?.id;

  const isUnclaimed = !isAuthor && usersWhoHaveClaimed?.length === 0;
  const isClaimedByUser = claimed_by?.some((c) => c.id === user?.id);

  useEffect(() => {
    const debounceFn = debounce(() => setIsLoading(true), 300);
    if (isLoadingClaimPost || isLoadingUnClaimPost) {
      debounceFn();
    } else {
      setIsLoading(false);
      debounceFn?.cancel();
    }

    return () => {
      debounceFn?.cancel();
    };
  }, [isLoadingClaimPost, isLoadingUnClaimPost]);

  return (
    <>
      <chakra.div
        backgroundColor="white"
        w="full"
        border="1px"
        borderColor={isPurchased && !isAuthor ? 'green.500' : 'gray.300'}
        borderRadius={8}
        overflow="hidden"
      >
        <Flex flexDirection="column">
          <Flex p={4}>
            <SkeletonCircle isLoaded={!isLoadingPost} mr={4}>
              <UserAvatar
                size="sm"
                mr={4}
                label={createdByUser?.name ?? ''}
                email={createdByUser?.email ?? ''}
              />
            </SkeletonCircle>
            <Flex w="full" gap={2} flexDirection="column" overflow="hidden">
              <Flex display="flex" justifyContent="space-between">
                <Skeleton isLoaded={!isLoadingPost} h={6}>
                  <Flex alignItems="center">
                    <Icon
                      mr={2}
                      color={isFavorited ? 'yellow.500' : 'gray.500'}
                      as={isFavorited ? IoStar : IoStarOutline}
                    />
                    <Text
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      fontSize="md"
                      fontWeight="medium"
                      color="gray.800"
                      as="h2"
                      mr={2}
                    >
                      {name ?? 'Loading...'}
                    </Text>
                  </Flex>
                </Skeleton>
                <Skeleton isLoaded={!isLoadingPost}>
                  <Text color="gray.500" fontSize="lg">
                    {price ? `€${price}` : 'Loading...'}
                  </Text>
                </Skeleton>
              </Flex>
              <Skeleton isLoaded={!isLoadingPost} w="60%">
                <Flex alignItems="center" gap={2}>
                  <Icon as={IoLink} color="slategray" />
                  <Link
                    color="blue.500"
                    href={url ?? ''}
                    target="_blank"
                    fontSize="sm"
                    textDecoration="underline"
                  >
                    {url}
                  </Link>
                </Flex>
              </Skeleton>
              {description ? (
                <Text color="gray.600" fontSize="sm">
                  {description}
                </Text>
              ) : (
                <SkeletonText
                  isLoaded={!isLoadingPost}
                  noOfLines={2}
                  skeletonHeight={4}
                />
              )}
              {isInShoppingList && (
                <Button
                  variant={isPurchased ? 'solid' : 'outline'}
                  alignSelf="flex-start"
                  size="sm"
                  colorScheme="green"
                  gap={2}
                  alignItems="center"
                  onClick={() =>
                    handleMarkAsPurchased({
                      postId: id,
                      isPurchased: !isPurchased,
                    })
                  }
                  isLoading={isLoadingMarkAsPurchased}
                >
                  <Icon as={IoCheckmarkCircle} />
                  {isPurchased ? 'Purchased' : 'Mark as purchased'}
                </Button>
              )}
            </Flex>
          </Flex>
          <Flex alignItems="center" bg="gray.100" px={4} py={3} gap={4}>
            {isAuthor ? (
              <Flex ml="auto" alignItems="center" gap={4}>
                <Skeleton isLoaded={!isLoadingPost}>
                  <Button
                    colorScheme="gray"
                    size="sm"
                    variant="link"
                    onClick={() => setIsDeletingPost(true)}
                  >
                    Delete
                  </Button>
                </Skeleton>
                <Skeleton isLoaded={!isLoadingPost}>
                  <Button
                    onClick={() =>
                      onEdit?.({ name, price, url, description, id })
                    }
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                </Skeleton>
              </Flex>
            ) : (
              <>
                <Skeleton isLoaded={!isLoadingPost} minH={4}>
                  <chakra.div
                    py={2}
                    flex={1}
                    alignItems="center"
                    display="flex"
                    gap={2}
                    minH={10}
                  >
                    {isUnclaimed ? (
                      <Text fontWeight="semibold" fontSize="sm">
                        Unclaimed
                      </Text>
                    ) : (
                      <>
                        <Text fontWeight="semibold" fontSize="sm">
                          Claimed by:
                        </Text>
                        <WishlistUsers size="xs" users={usersWhoHaveClaimed} />
                      </>
                    )}
                  </chakra.div>
                </Skeleton>
                <Skeleton isLoaded={!isLoadingPost} ml="auto">
                  <Flex>
                    {isPurchased && isInShoppingList ? null : isPurchased ? (
                      <Text fontSize="sm" fontWeight="medium">
                        Purchased
                      </Text>
                    ) : (
                      <Button
                        variant={isClaimedByUser ? 'outline' : 'solid'}
                        isLoading={isLoading}
                        isDisabled={!!isPurchased}
                        onClick={
                          isClaimedByUser
                            ? () =>
                                handleUnClaimPost(
                                  { postId: id },
                                  {
                                    onSuccess: () =>
                                      toast({
                                        title: 'Post unclaimed',
                                        status: 'success',
                                        description: `You have unclaimed ${createdByUser?.name}'s post`,
                                        isClosable: true,
                                      }),
                                  }
                                )
                            : () =>
                                handleClaimPost(
                                  { postId: id },
                                  {
                                    onSuccess: () =>
                                      toast({
                                        status: 'success',
                                        title: 'Post claimed',
                                        description: `You have claimed ${createdByUser?.name}'s post`,
                                        isClosable: true,
                                      }),
                                  }
                                )
                        }
                        colorScheme="blue"
                        size="sm"
                      >
                        <Icon
                          mr={1}
                          as={isClaimedByUser ? IoRemoveCircle : IoHandLeft}
                        />
                        {isClaimedByUser ? 'Unclaim' : 'Claim'}
                      </Button>
                    )}
                  </Flex>
                </Skeleton>
              </>
            )}
          </Flex>
        </Flex>
      </chakra.div>
      <PostDeleteConfirmPrompt
        isOpen={isDeletingPost}
        onClose={() => setIsDeletingPost(false)}
        wishlistId={wishlistId}
        postId={id}
        onCancel={() => setIsDeletingPost(false)}
      />
    </>
  );
};
