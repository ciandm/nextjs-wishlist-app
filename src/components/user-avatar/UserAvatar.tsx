import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { Avatar, AvatarProps as ChakraAvatarProps } from "@chakra-ui/react";
import { useGravatarHash } from "src/hooks/useGravatarHash";

interface AvatarProps extends ChakraAvatarProps {
  label: string;
  email: string;
}

export const UserAvatar = ({
  label,
  email = "",
  size = "md",
  ...rest
}: AvatarProps) => {
  const avatarHash = useGravatarHash(email);
  return (
    <Tooltip label={label}>
      <Avatar size={size} src={avatarHash} {...rest} />
    </Tooltip>
  );
};
