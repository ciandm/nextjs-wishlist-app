import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSupabaseClient } from 'supabase/useSupabaseClient';
import { useToast } from '@chakra-ui/react';

export const UserSetup = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const toast = useToast();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      switch (event) {
        case 'SIGNED_IN':
          if (router.pathname === '/login' || router.pathname === '/register') {
            router.push('/');
          }
          break;
        case 'SIGNED_OUT':
          toast({ title: 'You have logged out.', status: 'success' });
          break;
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth, router, toast]);

  return null;
};
