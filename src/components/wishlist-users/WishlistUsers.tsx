import React from "react";
import { AvatarGroup, AvatarProps } from "@chakra-ui/react";
import { useGetUser } from "src/hooks/queries/useGetUser";
import { UserAvatar } from "components/user-avatar/UserAvatar";

interface WishlistUsersProps {
  users: { id?: string; name?: string; email?: string }[];
  size?: AvatarProps["size"];
}

export const WishlistUsers = ({ users, size = "md" }: WishlistUsersProps) => {
  const { data: user } = useGetUser();

  return (
    <AvatarGroup>
      {users?.map((u) => (
        <UserAvatar
          key={u.id}
          label={user?.id === u?.id ? "You" : u?.name ?? ""}
          email={u?.email ?? ""}
          size={size}
        />
      ))}
    </AvatarGroup>
  );
};
