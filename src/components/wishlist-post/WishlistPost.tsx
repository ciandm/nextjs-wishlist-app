import {
  Icon,
  Text,
  chakra,
  Link,
  Button,
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
import { useUser } from '@supabase/auth-helpers-react';
import { useClaimPost } from 'src/hooks/mutations/useClaimPost';
import { useUnclaimPost } from 'src/hooks/mutations/useUnclaimPost';
import debounce from 'lodash/debounce';
import { Post } from 'types/utils';
import { PostDeleteConfirmPrompt } from 'components/post-delete-confirm-prompt/PostDeleteConfirmPrompt';
import { useMarkAsPurchased } from 'hooks/mutations/useMarkAsPurchased';
import { useToast } from 'hooks/useToast';

type PostProps = Post & {
  wishlist_id: string;
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
  user_id,
  wishlist_id,
  claimed_by,
  onEdit,
  is_purchased: isPurchased,
  isLoading: isLoadingPost,
  isInShoppingList,
}: PostProps) => {
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const user = useUser();
  const { data: users } = useGetWishlistUsers(wishlist_id);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { mutate: handleClaimPost, isLoading: isLoadingClaimPost } =
    useClaimPost({ wishlist_id });
  const { mutate: handleUnClaimPost, isLoading: isLoadingUnClaimPost } =
    useUnclaimPost({ wishlist_id });
  const { mutate: handleMarkAsPurchased, isLoading: isLoadingMarkAsPurchased } =
    useMarkAsPurchased({ wishlist_id });

  const createdByUser = users?.find((u) => u.id === user_id);

  const usersWhoHaveClaimed =
    users?.filter((u) => claimed_by?.some((c) => c.id === u.id)) ?? [];

  const isAuthor = user_id === user?.id;

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
      <Flex
        flexDirection="column"
        backgroundColor="white"
        w="full"
        border="1px"
        borderColor={isPurchased && !isAuthor ? 'green.500' : 'gray.300'}
        borderRadius={8}
        overflow="hidden"
      >
        <Flex flex={1} flexDirection="column">
          <Flex w="full" p={4} flex={1}>
            <SkeletonCircle isLoaded={!isLoadingPost} mr={4}>
              <UserAvatar
                size="sm"
                mr={4}
                label={createdByUser?.name ?? ''}
                email={createdByUser?.email ?? ''}
              />
            </SkeletonCircle>
            <Flex w="full" gap={2} flexDirection="column" overflow="hidden">
              <Flex
                display="flex"
                justifyContent="space-between"
                overflow="hidden"
              >
                <Skeleton isLoaded={!isLoadingPost} h={6} overflow="hidden">
                  <Flex alignItems="center" overflow="hidden">
                    <Icon
                      mr={2}
                      color={isFavorited ? 'yellow.500' : 'gray.500'}
                      as={isFavorited ? IoStar : IoStarOutline}
                    />
                    <Text
                      overflow="hidden"
                      textOverflow="ellipsis"
                      fontSize="md"
                      fontWeight="medium"
                      color="gray.800"
                      as="h2"
                      mr={2}
                      noOfLines={1}
                      w="full"
                      wordBreak="break-all"
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
              <Skeleton isLoaded={!isLoadingPost}>
                <Flex alignItems="center" gap={2}>
                  <Icon as={IoLink} color="slategray" />
                  <Link
                    color="blue.500"
                    href={url ?? ''}
                    target="_blank"
                    fontSize="sm"
                    textDecoration="underline"
                    noOfLines={1}
                    wordBreak="break-all"
                    w="full"
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
                  mt="auto"
                  variant={isPurchased ? 'solid' : 'outline'}
                  alignSelf="flex-start"
                  size="sm"
                  colorScheme="green"
                  gap={2}
                  alignItems="center"
                  onClick={() =>
                    handleMarkAsPurchased({
                      post_id: id,
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
                                  { post_id: id },
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
                                  { post_id: id },
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
      </Flex>
      <PostDeleteConfirmPrompt
        isOpen={isDeletingPost}
        onClose={() => setIsDeletingPost(false)}
        wishlist_id={wishlist_id}
        post_id={id}
        onCancel={() => setIsDeletingPost(false)}
      />
    </>
  );
};
