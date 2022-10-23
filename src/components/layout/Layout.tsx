import React, { useEffect, useState } from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import { SignOutButton } from 'components/sign-out-button/SignOutButton';
import { useSupabaseClient } from 'supabase/useSupabaseClient';
import { useRouter } from 'next/router';
import { CenteredSpinner } from 'components/centered-spinner/CenteredSpinner';

export const Layout = ({
  children,
  hasSignOut = true,
}: React.PropsWithChildren<{ hasSignOut?: boolean }>) => {
  return (
    <Flex
      bgGradient="linear(to-br, gray.100, gray.200)"
      flexDirection="column"
      mx="auto"
    >
      <Flex
        minHeight="100vh"
        mx="auto"
        py={[null, null, 12]}
        w="full"
        maxW={[null, null, 720]}
      >
        {children}
      </Flex>
      {hasSignOut && <SignOutButton />}
    </Flex>
  );
};

export const RestrictedLayout = ({ children }: React.PropsWithChildren) => {
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

  return <Layout>{children}</Layout>;
};

const LoginLayout = ({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    p={4}
    my="auto"
    w="full"
  >
    <Heading color="gray.800" mb={6}>
      {title}
    </Heading>
    {children}
  </Flex>
);

export const getLoginlayout =
  ({ title }: { title: string }) =>
  // eslint-disable-next-line react/display-name
  (page: React.ReactNode) =>
    (
      <Layout hasSignOut={false}>
        <LoginLayout title={title}>{page}</LoginLayout>
      </Layout>
    );
