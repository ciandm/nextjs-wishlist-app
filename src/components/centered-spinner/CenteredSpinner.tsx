import { Flex, Spinner, Text } from '@chakra-ui/react';
import React from 'react';

export const CenteredSpinner = ({ children }: React.PropsWithChildren) => {
  return (
    <Flex flexDirection="column" alignItems="center">
      <Spinner size="lg" />
      <Text mt={2}>{children}</Text>
    </Flex>
  );
};
