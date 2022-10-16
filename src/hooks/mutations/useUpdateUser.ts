import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { useUser } from '@supabase/auth-helpers-react';
import { Database } from 'types/database.types';
import { GET_USER_KEY } from 'src/hooks/queries/useGetUser';

type UpdateUserInput = {
  name: string;
};

type UpdateUserReturn = Database['public']['Tables']['users']['Row'];

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { users } = useSupabaseClient();
  const user = useUser();

  return useMutation<UpdateUserReturn, unknown, UpdateUserInput>(
    async ({ name }) => {
      const result = await users.update({ name }).eq('id', user?.id).select();

      if (!result.data?.[0]) {
        throw new Error('Failed to update user');
      }

      return result.data?.[0];
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(GET_USER_KEY.query(user?.id ?? ''), {
          ...data,
        });
      },
    }
  );
};
