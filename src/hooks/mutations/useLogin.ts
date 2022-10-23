import { useMutation } from '@tanstack/react-query';
import { useSupabaseClient } from 'supabase/useSupabaseClient';

type LoginRequest = { email: string; password: string };

export const useLogin = () => {
  const supabase = useSupabaseClient();

  return useMutation(async ({ email, password }: LoginRequest) => {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) {
      return Promise.reject(response.error);
    }

    return response.data;
  });
};
