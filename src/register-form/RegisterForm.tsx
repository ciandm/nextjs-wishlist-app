import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoLockClosed, IoMail, IoPerson } from 'react-icons/io5';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FormWrapper } from 'components/form-wrapper/FormWrapper';
import { AuthError } from '@supabase/supabase-js';

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
}

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormState>();
  const { auth } = useSupabaseClient();
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const onSubmit = handleSubmit(async ({ email, password, name }) => {
    try {
      setLoading(true);
      const { error } = await auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: '/',
          data: {
            name,
          },
        },
      });
      if (error) throw error;
      router.push('/');
    } catch (error) {
      if (error instanceof AuthError) {
        toast({
          title: 'Something went wrong',
          description: error.message,
          status: 'error',
        });
      } else {
        toast({
          title: 'Something went wrong',
          description: 'Please try again.',
          status: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormWrapper
      buttonLabel="Sign up"
      isLoading={isLoading}
      onSubmit={onSubmit}
      renderFooter={() => (
        <>
          <Text>Have an account?</Text>
          <NextLink href="/login" passHref>
            <Link mt={1} color="blue.500">
              Log in
            </Link>
          </NextLink>
        </>
      )}
    >
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>First name</FormLabel>
        <InputGroup>
          <InputLeftAddon>
            <Icon color="gray.500" as={IoPerson} />
          </InputLeftAddon>
          <Input
            {...register('name', {
              required: { value: true, message: 'A name is required' },
              onBlur: (e) => setValue('name', e.currentTarget.value.trim()),
            })}
            placeholder="John"
          />
        </InputGroup>
        <FormErrorMessage>
          {errors?.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.email}>
        <FormLabel>Email</FormLabel>
        <InputGroup>
          <InputLeftAddon>
            <Icon color="gray.500" as={IoMail} />
          </InputLeftAddon>
          <Input
            type="email"
            {...register('email', {
              required: { value: true, message: 'An email is required' },
              onBlur: (e) => setValue('email', e.currentTarget.value.trim()),
            })}
            placeholder="johndoe@gmail.com"
          />
        </InputGroup>
        <FormErrorMessage>
          {errors?.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.password}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <InputLeftAddon>
            <Icon color="gray.500" as={IoLockClosed} />
          </InputLeftAddon>
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            {...register('password', {
              required: { value: true, message: 'A password is required' },
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
              onBlur: (e: React.SyntheticEvent<HTMLInputElement>) =>
                setValue('password', e.currentTarget.value.trim()),
            })}
          />
          <InputRightElement w="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
            >
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>
          {errors?.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
    </FormWrapper>
  );
};
