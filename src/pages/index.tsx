import { NextPage } from 'next';
import React from 'react';
import {
  chakra,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Text,
  Skeleton,
  Flex,
} from '@chakra-ui/react';
import { useGetWishlistsByUserId } from 'src/hooks/queries/useGetWishlistsByUserId/useGetWishlistsByUserId';
import { UserWishlists } from 'components/user-wishlists/UserWishlists';
import { UserShoppingList } from 'components/user-shopping-list/UserShoppingList';
import { useGetUsersClaimedPosts } from 'hooks/queries/useGetUsersClaimedPosts';

import { withPageAuth } from '@supabase/auth-helpers-nextjs';

const Home: NextPage = () => {
  const { isLoading: isLoadingWishlists } = useGetWishlistsByUserId();
  const { data: claimedPosts } = useGetUsersClaimedPosts();

  const shoppingListCount =
    claimedPosts?.reduce((acc, curr) => curr?.posts?.length + acc, 0) ?? 0;

  return (
    <>
      <chakra.div flex={1}>
        <chakra.div>
          <Tabs
            minH={['100vh', null, 'initial']}
            display="flex"
            flexDirection="column"
          >
            <TabList bg="gray.100">
              <Tab isDisabled={isLoadingWishlists}>
                <Skeleton isLoaded={!isLoadingWishlists}>Wishlists</Skeleton>
              </Tab>
              <Tab isDisabled={isLoadingWishlists}>
                <Skeleton isLoaded={!isLoadingWishlists}>
                  Shopping list
                </Skeleton>
                {shoppingListCount > 0 && (
                  <Badge colorScheme="blue" ml={2} borderRadius={999}>
                    <Text fontSize="sm" fontWeight="bold">
                      {shoppingListCount}
                    </Text>
                  </Badge>
                )}
              </Tab>
            </TabList>
            <TabPanels
              overflow="hidden"
              flex={1}
              display="flex"
              flexDirection="column"
            >
              <TabPanel
                overflow="hidden"
                display="flex"
                flexDirection="column"
                flex={1}
                p={0}
              >
                <Flex overflow="hidden" flexDirection="column" flex={1}>
                  <Flex flexDirection="column" flex={1} overflowY="auto">
                    <UserWishlists />
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel
                overflow="hidden"
                flex={1}
                display="flex"
                flexDirection="column"
              >
                <chakra.div
                  overflow="hidden"
                  display="flex"
                  flexDirection="column"
                  flex={1}
                  pb={16}
                >
                  <UserShoppingList />
                </chakra.div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </chakra.div>
      </chakra.div>
    </>
  );
};

export default Home;

export const getServerSideProps = withPageAuth({ redirectTo: '/login' });
