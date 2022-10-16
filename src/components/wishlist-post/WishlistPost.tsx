import {
  Avatar,
  AvatarGroup,
  Icon,
  IconButton,
  Text,
  chakra,
  Link,
  Tooltip,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import { IoLink, IoHandLeft } from "react-icons/io5";

export const WishlistPost = () => {
  return (
    <chakra.div
      backgroundColor="white"
      w="full"
      borderRadius={4}
      overflow="hidden"
    >
      <chakra.div gap={2} p={4} pb={2} display="flex" alignItems="center">
        <Tooltip label="Claim">
          <IconButton aria-label="Claim" isRound colorScheme="blue">
            <Icon as={IoHandLeft} />
          </IconButton>
        </Tooltip>
        <chakra.div display="flex" flexDirection="column" gap={0.5}>
          <Heading
            fontSize="lg"
            fontWeight="medium"
            color="gray.800"
            as="h2"
            noOfLines={1}
          >
            Post title
          </Heading>
          <Text color="gray.500">€3.99</Text>
        </chakra.div>
      </chakra.div>
      <div>
        <chakra.div px={4} pb={4}>
          <chakra.div display="flex" alignItems="center" gap={2} mb={2}>
            <Icon as={IoLink} color="slategray" />
            <Link
              color="blue.500"
              href="#"
              className="truncate"
              textDecoration="underline"
            >
              https://www.amazon.co.uk
            </Link>
          </chakra.div>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel
            imperdiet enim, sed convallis justo.{" "}
          </Text>
        </chakra.div>
        <chakra.div
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="gray.200"
          p={4}
        >
          <Text>Claimed by:</Text>
          <AvatarGroup size="sm">
            <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
            <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
          </AvatarGroup>
        </chakra.div>
      </div>
    </chakra.div>
  );
};
