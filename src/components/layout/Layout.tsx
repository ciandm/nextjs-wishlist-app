import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { SignOutButton } from 'components/sign-out-button/SignOutButton';
import { useSupabaseClient } from 'supabase/useSupabaseClient';
import { useRouter } from 'next/router';
import { CenteredSpinner } from 'components/centered-spinner/CenteredSpinner';

export const Layout = ({ children }: React.PropsWithChildren) => {
  const { auth } = useSupabaseClient();
  const [isInitialised, setIsInitialised] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getAuthUser() {
      const { data } = await auth.getSession();

      if (!data.session) {
        router.push('/login');
      } else {
        setIsInitialised(true);
      }
    }

    getAuthUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isInitialised) {
    return (
      <Flex h="100vh" justifyContent="center" alignItems="center">
        <CenteredSpinner />
      </Flex>
    );
  }

  return (
    <Flex bg="gray.100" flexDirection="column" minHeight="100vh" mx="auto">
      <Flex mx="auto" py={[null, null, 12]} w="full" maxW={[null, null, 720]}>
        {children}
      </Flex>
      <SignOutButton />
    </Flex>
  );
};
