import React from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { User } from '@supabase/supabase-js';
import { AxiosError } from 'axios';

type LoginRequest = { email: string; password: string };

export const useLogin = () => {
  const router = useRouter();

  return useMutation<User, AxiosError, LoginRequest>(
    async ({ email, password }) => {
      return axios.post('/api/sign-in', { email, password });
    },
    {
      onSuccess: () => {
        router.push('/');
      },
    }
  );
};
