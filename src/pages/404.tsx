import { Button, Flex, Heading } from '@chakra-ui/react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <Flex alignItems="center" justifyContent="center" w="full">
      <Flex flexDirection="column" alignItems="center" gap={4}>
        <Heading fontSize="xl">404 - Page Not Found</Heading>
        <Link href="/" passHref>
          <Button colorScheme="blue">Return to home</Button>
        </Link>
      </Flex>
    </Flex>
  );
}
