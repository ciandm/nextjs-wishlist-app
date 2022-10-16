import React, { useEffect } from 'react';
import { useState } from 'react';
import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useSupabaseClient } from 'src/supabase/useSupabaseClient';
import { NextPageWithLayout } from 'pages/_app';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  useToast,
} from '@chakra-ui/react';
import { IoMailOpen } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

interface LoginFormState {
  email: string;
}

const Login: NextPageWithLayout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormState>();
  const user = useUser();
  const { auth } = useSupabaseClient();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  if (user?.id) {
    router.push('/');
  }

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      setLoading(true);
      const { error } = await auth.signInWithOtp({
        email,
        options: { emailRedirectTo: '/' },
      });
      if (error) throw error;
      toast({
        title: 'Check your email',
        description: 'You should receive an email with a link shortly.',
        status: 'success',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Flex
      flexDirection="column"
      bg="gray.200"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Heading color="blue.600" mb={6}>
        Wishlist
      </Heading>
      <Flex
        maxW={400}
        border="1px"
        borderColor="gray.300"
        bg="white"
        as="form"
        px={4}
        py={6}
        w="full"
        borderRadius={8}
        flexDirection="column"
        gap={4}
        onSubmit={onSubmit}
      >
        <Text>
          Enter your email to receive a link to log in. You must be registered
          beforehand to have access.
        </Text>
        <FormControl isInvalid={!!errors.email}>
          <InputGroup>
            <InputLeftAddon>
              <Icon color="gray.500" as={IoMailOpen} />
            </InputLeftAddon>
            <Input
              type="email"
              {...register('email', {
                required: { value: true, message: 'An email is required' },
                onBlur: (e) => setValue('email', e.target.value.trim()),
              })}
              placeholder="johndoe@gmail.com"
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          isLoading={isLoading}
          loadingText="Submitting..."
          type="submit"
          colorScheme="blue"
        >
          Submit
        </Button>
      </Flex>
    </Flex>
  );
};

export default Login;

Login.getLayout = (page) => page;
