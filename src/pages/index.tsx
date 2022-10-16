import { NextPage } from 'next';
import React, { useState } from 'react';
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
  Button,
} from '@chakra-ui/react';
import { useGetWishlistsByUserId } from 'src/hooks/queries/useGetWishlistsByUserId/useGetWishlistsByUserId';
import { UpdateUserForm } from 'components/update-user-form/UpdateUserForm';
import { UserWishlists } from 'components/user-wishlists/UserWishlists';
import { UserShoppingList } from 'components/user-shopping-list/UserShoppingList';

const Home: NextPage = () => {
  const { data: wishlists, isLoading: isLoadingWishlists } =
    useGetWishlistsByUserId();

  const [shoppingListCount, setShoppingListCount] = useState(0);
  return (
    <>
      <chakra.div flex={1}>
        <chakra.div>
          <Tabs
            height="100vh"
            maxH={'100vh'}
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
                >
                  <UserShoppingList setCount={setShoppingListCount} />
                </chakra.div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </chakra.div>
      </chakra.div>
      <UpdateUserForm />
    </>
  );
};

export default Home;
