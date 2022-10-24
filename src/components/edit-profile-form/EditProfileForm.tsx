import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { useToast } from 'hooks/useToast';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSupabaseClient } from 'supabase/useSupabaseClient';

interface EditProfileFormState {
  name: string;
}

export const EditProfileForm = () => {
  const user = useUser();
  const { register, setValue, handleSubmit } = useForm<EditProfileFormState>({
    defaultValues: {},
  });
  const { users } = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function fetchUser() {
      const { data } = await users.select('*').eq('id', user?.id).single();

      if (data?.name) {
        setValue('name', data.name);
      }
    }

    fetchUser();
  }, [user, setValue, users]);

  const onSubmit = handleSubmit(async ({ name }) => {
    try {
      setIsLoading(true);
      await users.update({ name }).eq('id', user?.id);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
        status: 'success',
        position: 'bottom',
      });
    } catch (e) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Flex as="form" flexDirection="column" onSubmit={onSubmit}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          {...register('name', {
            required: 'Name is required',
          })}
          bg="white"
        />
      </FormControl>
      <Button isLoading={isLoading} colorScheme="blue" mt={4} type="submit">
        Submit
      </Button>
    </Flex>
  );
};
