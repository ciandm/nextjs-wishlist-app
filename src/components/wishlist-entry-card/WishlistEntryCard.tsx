import NextLink from "next/link";
import React, { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  chakra,
  Icon,
  IconButton,
  Link,
  Tooltip,
  Skeleton,
} from "@chakra-ui/react";
import { IoTrashBin } from "react-icons/io5";
import { trpc } from "src/utils/trpc";
import { WishlistDeleteConfirmPrompt } from "../wishlist-delete-confirm-prompt/WishlistDeleteConfirmPrompt";

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
  const { data: usersInWishlist, isLoading: isLoadingUsersInWishlist } =
    trpc.wishlist.retrieveAllUsers.useQuery(
      { wishlistId: id ?? "" },
      { enabled: !!id }
    );

  return (
    <>
      <chakra.div
        display="flex"
        flexDirection="column"
        p={4}
        backgroundColor="white"
        width="full"
        borderRadius={4}
      >
        <NextLink href="/" passHref>
          <Link
            fontSize="lg"
            fontWeight="medium"
            color="gray.800"
            _hover={{
              color: "blue.500",
            }}
            noOfLines={1}
            mb={2}
          >
            <Skeleton h={6} isLoaded={!isLoading}>
              {name ?? "Loading..."}
            </Skeleton>
          </Link>
        </NextLink>
        <chakra.div
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {isLoadingUsersInWishlist ? (
            <Skeleton h={6} rounded={10000} width={16} />
          ) : (
            <AvatarGroup>
              {usersInWishlist?.map((user) => (
                <Tooltip key={user.id} label={user?.email}>
                  <Avatar size="sm" src={user?.image ?? ""} />
                </Tooltip>
              ))}
            </AvatarGroup>
          )}
          {isAdmin && (
            <Tooltip label="Delete wishlist">
              <IconButton
                aria-label="Delete"
                colorScheme="red"
                variant="ghost"
                isRound
                onClick={() => setIsDeleteConfirmOpen(true)}
              >
                <Icon as={IoTrashBin} />
              </IconButton>
            </Tooltip>
          )}
        </chakra.div>
      </chakra.div>
      <WishlistDeleteConfirmPrompt
        isOpen={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onClose={() => setIsDeleteConfirmOpen(false)}
        wishlistId={id ?? ""}
      />
    </>
  );
};
