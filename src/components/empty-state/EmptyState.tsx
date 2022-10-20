import { Flex, Text, ChakraProps, Box } from '@chakra-ui/react';
import React from 'react';
import Image from 'next/image';

type EmptyStateProps = ChakraProps & {
  title: string;
  description: string;
  src: string;
};

export const EmptyState = ({
  title,
  description,
  src,
  ...rest
}: EmptyStateProps) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      direction="column"
      flex={1}
      mt="auto"
      {...rest}
    >
      <Box w="full" position="relative" height={240}>
        <Image layout="fill" src={src} alt="Empty wishlists" />
      </Box>
      <Flex direction="column" alignItems="center">
        <Text mt={8} mb={2} fontSize="xl" fontWeight="bold" textAlign="center">
          {title}
        </Text>
        <Text textAlign="center">{description}</Text>
      </Flex>
    </Flex>
  );
};
