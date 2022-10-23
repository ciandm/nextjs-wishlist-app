import { useMutation } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';
import { useSupabaseClient } from 'supabase/useSupabaseClient';

type LoginRequest = { email: string; password: string };

export const useLogin = () => {
  const supabase = useSupabaseClient();

  return useMutation<User, unknown, LoginRequest>(
    async ({ email, password }) => {
      return supabase.auth
        .signInWithPassword({
          email,
          password,
        })
        .then((response) => response.data?.user)
        .catch((e) => e);
    }
  );
};
