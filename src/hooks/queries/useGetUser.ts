import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { useUser } from '@supabase/auth-helpers-react';

export const GET_USER_KEY = {
  base: { name: 'GET_USER' },
  query: (id: string) => [{ ...GET_USER_KEY.base, id }],
};

export type UseGetUserReturn = {
  name: string;
  email: string;
  id: string;
};

interface UseGetUserProps {
  onSuccess?: (data: UseGetUserReturn) => void;
}

export const useGetUser = (props: UseGetUserProps = {}) => {
  const { onSuccess } = props;
  const user = useUser();
  const { users } = useSupabaseClient();

  return useQuery(
    GET_USER_KEY.query(user?.id ?? ''),
    async () => {
      const result = await users.select('*').eq('id', user?.id);

      const { email, name, id } = result?.data?.[0] ?? {};

      return {
        email: email ?? '',
        id: id ?? '',
        name: name ?? '',
      };
    }
    // { enabled: !!user?.id, onSuccess }
  );
};
