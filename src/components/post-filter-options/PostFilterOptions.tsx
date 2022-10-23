import { HStack, Select } from '@chakra-ui/react';
import React from 'react';
import { useGetWishlistUsers } from 'src/hooks/queries/useGetWishlistUsers/useGetWishlistUsers';
import { useUser } from '@supabase/auth-helpers-react';
import { StatusFilterType } from 'components/other-posts/OtherPosts';

interface PostFilterOptionsProps {
  wishlist_id: string;
  userFilter?: string;
  statusFilter?: StatusFilterType;
  onSetStatusFilter?: (statusFilter?: StatusFilterType) => void;
  onSetUserFilter: (userFilter?: string) => void;
}

export const PostFilterOptions = ({
  wishlist_id,
  onSetStatusFilter,
  statusFilter,
  onSetUserFilter,
  userFilter,
}: PostFilterOptionsProps) => {
  const { data: wishlistUsers } = useGetWishlistUsers(wishlist_id);
  const user = useUser();

  return (
    <>
      <HStack mb={4} gap={2}>
        <Select
          border="1px"
          borderColor="gray.300"
          value={userFilter}
          variant="filled"
          bg="white"
          onChange={(e) => onSetUserFilter(e.target.value)}
          placeholder="Filter by user"
        >
          {wishlistUsers
            ?.filter((u) => u.id !== user?.id)
            .map((u) => (
              <option key={u?.id} value={u?.id}>
                {u?.name}
              </option>
            ))}
        </Select>
        <Select
          border="1px"
          borderColor="gray.300"
          value={statusFilter}
          variant="filled"
          bg="white"
          onChange={(e) =>
            onSetStatusFilter?.(
              e.target.value
                ? (e.target.value as StatusFilterType | undefined)
                : undefined
            )
          }
          placeholder="Filter by status"
        >
          <option value="claimed">Claimed</option>
          <option value="unclaimed">Unclaimed</option>
          <option value="claimed-by-user">Claimed by you</option>
        </Select>
      </HStack>
    </>
  );
};
