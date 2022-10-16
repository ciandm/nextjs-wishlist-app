import { IconButton, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { IoLogOut } from 'react-icons/io5';
import { useSupabaseClient } from 'supabase/useSupabaseClient';

export const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useSupabaseClient();
  const router = useRouter();

  async function handleOnSignout() {
    setIsLoading(true);
    await auth.signOut().then(() => {
      router.push('/login');
    });
  }

  return (
    <>
      <Tooltip label="Log out" placement="left">
        <IconButton
          isLoading={isLoading}
          onClick={() => handleOnSignout()}
          aria-label="logout"
          icon={<IoLogOut />}
          isRound
          variant="solid"
          colorScheme="blue"
          position="fixed"
          right={process.env.NODE_ENV === 'development' ? 3 : undefined}
          left={process.env.NODE_ENV === 'development' ? undefined : 3}
          bottom={3}
        />
      </Tooltip>
    </>
  );
};
