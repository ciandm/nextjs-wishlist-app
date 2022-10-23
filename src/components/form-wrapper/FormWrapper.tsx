import { Button, Flex, FlexProps } from '@chakra-ui/react';
import React, { PropsWithChildren, ReactNode } from 'react';

type FormWrapperProps = FlexProps &
  PropsWithChildren<{
    renderFooter?: () => ReactNode;
    buttonLabel: string;
    isLoading: boolean;
  }>;

export const FormWrapper = ({
  isLoading,
  children,
  buttonLabel,
  renderFooter,
  ...rest
}: FormWrapperProps) => {
  return (
    <Flex
      maxW={400}
      border="1px"
      borderColor="gray.300"
      bg="white"
      as="form"
      px={4}
      py={6}
      w="full"
      borderRadius={8}
      flexDirection="column"
      gap={4}
      {...rest}
    >
      {children}
      <Button
        isLoading={isLoading}
        loadingText="Submitting..."
        type="submit"
        colorScheme="blue"
        mt={2}
      >
        {buttonLabel}
      </Button>
      <Flex
        borderTop="1px"
        borderTopColor="gray.200"
        alignItems="center"
        flexDirection="column"
        pt={3}
        mt={3}
      >
        {renderFooter?.()}
      </Flex>
    </Flex>
  );
};
