import React from 'react';
import { AvatarGroup, AvatarProps } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { UserAvatar } from 'components/user-avatar/UserAvatar';
import sortBy from 'lodash/sortBy';

interface WishlistUsersProps {
  users: { id?: string; name?: string; email?: string }[];
  size?: AvatarProps['size'];
}

export const WishlistUsers = ({ users, size = 'md' }: WishlistUsersProps) => {
  const user = useUser();

  const sortedUsers = sortBy(users, (_user) => {
    return _user.id === user?.id ? 0 : 1;
  });

  return (
    <AvatarGroup>
      {sortedUsers?.map((u) => (
        <UserAvatar
          key={u.id}
          label={user?.id === u?.id ? 'You' : u?.name ?? ''}
          email={u?.email ?? ''}
          size={size}
        />
      ))}
    </AvatarGroup>
  );
};
