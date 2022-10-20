import React from 'react';
import { useGetWishlist } from 'src/hooks/queries/useGetWishlist';
import { useRouter } from 'next/router';
import { useGetWishlistUsers } from 'src/hooks/queries/useGetWishlistUsers/useGetWishlistUsers';
import { WishlistUsers } from 'components/wishlist-users/WishlistUsers';
import {
  Heading,
  chakra,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Badge,
  Text,
  Flex,
  Icon,
  Skeleton,
} from '@chakra-ui/react';
import Link from 'next/link';
import { OtherPosts } from 'components/other-posts/OtherPosts';
import { useGetUser } from 'src/hooks/queries/useGetUser';
import { UserPosts } from 'src/components/user-posts/UserPosts';
import { useGetWishlistPosts } from 'hooks/queries/useGetWishlistPosts';
import { IoCheckmarkCircle, IoInformationCircle } from 'react-icons/io5';
import { EmptyState } from 'components/empty-state/EmptyState';
import emptyPosts from 'public/images/empty-posts.svg';

const WishlistPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: user } = useGetUser();
  const { data: wishlist, isLoading: isLoadingWishlist } = useGetWishlist(id);
  const { data: wishlistUsers = [] } = useGetWishlistUsers(id);
  const { data: wishlistPosts = [] } = useGetWishlistPosts(id);

  const otherPosts = wishlistPosts.filter(
    (post) => post.created_by !== user?.id
  );

  const userPosts = wishlistPosts.filter(
    (post) => post.created_by === user?.id
  );

  const othersWhoUserHasClaimedFor = wishlistPosts.reduce<string[]>(
    (users, post) => {
      if (post.claimed_by.map(({ id }) => id).includes(user?.id ?? '')) {
        return [...users, post?.created_by ?? ''];
      }
      return users;
    },
    []
  );

  const othersWhoUserHasNotClaimedForCount = wishlistUsers.filter(
    (u) =>
      u.id !== user?.id &&
      !othersWhoUserHasClaimedFor.includes(u.id) &&
      otherPosts.filter((post) => post.created_by === u.id).length > 0
  )?.length;

  const unclaimedOtherPosts = otherPosts.filter(
    (post) => post.claimed_by.length === 0
  );

  return (
    <Flex flexDirection="column" flex={1}>
      <Breadcrumb pt={4} px={4}>
        <BreadcrumbItem>
          <Skeleton isLoaded={!isLoadingWishlist}>
            <BreadcrumbLink as={Link} href="/">
              Home
            </BreadcrumbLink>
          </Skeleton>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Skeleton isLoaded={!isLoadingWishlist}>
            <BreadcrumbLink>{wishlist?.name ?? 'Loading...'}</BreadcrumbLink>
          </Skeleton>
        </BreadcrumbItem>
      </Breadcrumb>

      <chakra.div px={4} pt={2} pb={4}>
        <Skeleton w="80" isLoaded={!isLoadingWishlist}>
          <Heading fontSize="2xl" mb={2}>
            {wishlist?.name ?? 'Loading...'}
          </Heading>
        </Skeleton>
        <chakra.div display="flex" gap={2} alignItems="center">
          <Skeleton isLoaded={!isLoadingWishlist}>
            <WishlistUsers size="xs" users={wishlistUsers} />
          </Skeleton>
          <Skeleton isLoaded={!isLoadingWishlist}>
            <Text>
              {wishlistUsers?.length} users / {wishlistPosts?.length} posts
            </Text>
          </Skeleton>
        </chakra.div>
        <InfoMessages
          totalUsers={wishlistUsers?.length}
          othersWhoUserHasClaimedFor={othersWhoUserHasClaimedFor?.length}
          othersWhoUserHasNotClaimedFor={othersWhoUserHasNotClaimedForCount}
          totalPosts={wishlistPosts?.length}
          unclaimedOtherPosts={unclaimedOtherPosts?.length}
        />
      </chakra.div>

      <Tabs display="flex" flexDirection="column" flex={1}>
        <TabList borderColor="gray.300" zIndex={200}>
          <Tab isDisabled={isLoadingWishlist}>
            <Skeleton isLoaded={!isLoadingWishlist}>
              Your posts
              {userPosts?.length > 0 && (
                <Badge colorScheme="blue" ml={2} borderRadius={999}>
                  <Text fontSize="sm" fontWeight="bold">
                    {userPosts.length}
                  </Text>
                </Badge>
              )}
            </Skeleton>
          </Tab>
          <Tab isDisabled={isLoadingWishlist}>
            <Skeleton isLoaded={!isLoadingWishlist}>
              Other posts{' '}
              {otherPosts?.length > 0 && (
                <Badge colorScheme="blue" ml={2} borderRadius={999}>
                  <Text fontSize="sm" fontWeight="bold">
                    {otherPosts.length}
                  </Text>
                </Badge>
              )}
            </Skeleton>
          </Tab>
        </TabList>
        <TabPanels display="flex" flexDirection="column" flex={1} px={4}>
          <TabPanel flex={1} px={0}>
            <UserPosts wishlistId={id} />
          </TabPanel>
          <TabPanel
            display="flex"
            flexDirection="column"
            flex={1}
            px={0}
            pb={16}
          >
            {otherPosts?.length > 0 ? (
              <OtherPosts wishlistId={wishlist?.id ?? ''} />
            ) : (
              <EmptyState
                mt="auto"
                title="No posts"
                description="There are currently no posts by other users at this time"
                src={emptyPosts}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default WishlistPage;

const InfoMessages = ({
  totalUsers,
  totalPosts,
  unclaimedOtherPosts,
  othersWhoUserHasClaimedFor,
  othersWhoUserHasNotClaimedFor,
}: {
  totalPosts: number;
  unclaimedOtherPosts: number;
  othersWhoUserHasClaimedFor: number;
  othersWhoUserHasNotClaimedFor: number;
  totalUsers: number;
}) => {
  const messages = [] as { message: string; type: 'info' | 'success' }[];

  if (totalPosts === 0) {
    return null;
  }

  if (unclaimedOtherPosts > 0) {
    messages.push({
      message:
        unclaimedOtherPosts === 1
          ? `There is ${unclaimedOtherPosts} post that has not been claimed.`
          : `There are ${unclaimedOtherPosts} posts that have not been claimed.`,
      type: 'info',
    });
  }

  if (othersWhoUserHasNotClaimedFor > 0) {
    messages.push({
      message:
        othersWhoUserHasNotClaimedFor === 1
          ? `You have not claimed a post for ${othersWhoUserHasNotClaimedFor} other user.`
          : `You have not claimed a post for ${othersWhoUserHasNotClaimedFor} other users.`,
      type: 'info',
    });
  }

  if (
    othersWhoUserHasClaimedFor > 0 &&
    othersWhoUserHasClaimedFor < totalUsers - 1
  ) {
    messages.push({
      message: `You have claimed a gift for ${othersWhoUserHasClaimedFor} / ${
        totalUsers - 1
      } users.`,
      type: 'info',
    });
  }

  if (othersWhoUserHasClaimedFor === totalUsers - 1) {
    messages.push({
      message: 'You have claimed a gift for everyone',
      type: 'success',
    });
  }

  return (
    <>
      {messages.map(({ message, type }) => {
        return (
          <Flex key={message} mt={2} gap={2}>
            <Icon
              flexShrink={0}
              mt={1}
              color={type === 'info' ? 'gray.500' : 'green.500'}
              as={type === 'info' ? IoInformationCircle : IoCheckmarkCircle}
            />
            <Text fontSize="sm">{message}</Text>
          </Flex>
        );
      })}
    </>
  );
};
