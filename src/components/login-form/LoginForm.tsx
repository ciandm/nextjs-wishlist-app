import {
  Button,
  Checkbox,
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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoLockClosed, IoMail } from 'react-icons/io5';
import NextLink from 'next/link';
import { FormWrapper } from 'components/form-wrapper/FormWrapper';
import { useLogin } from 'hooks/mutations/useLogin';
import { useToast } from 'hooks/useToast';
import { AuthError } from '@supabase/supabase-js';

interface LoginFormState {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormState>();
  const [isRememberMe, setIsRememberMe] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { mutate: handleLogIn } = useLogin();

  useEffect(() => {
    const password = localStorage.getItem('password');
    const email = localStorage.getItem('email');
    if (password) {
      setValue('password', password);
    }
    if (email) {
      setValue('email', email);
    }
  }, [setValue]);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setLoading(true);
    handleLogIn(
      { email, password },
      {
        onError: (error) => {
          if (error instanceof AuthError) {
            toast({
              title: 'Something went wrong',
              description: error.message,
              status: 'error',
            });
          } else {
            toast({
              title: 'Something went wrong',
              description: 'Please try again',
              status: 'error',
            });
          }
          setLoading(false);
        },
        onSuccess: () => {
          if (isRememberMe) {
            localStorage.setItem('password', password);
            localStorage.setItem('email', email);
          } else {
            localStorage.removeItem('password');
            localStorage.removeItem('email');
          }
          setLoading(false);
        },
      }
    );
  });

  return (
    <FormWrapper
      onSubmit={onSubmit}
      buttonLabel="Log in"
      isLoading={isLoading}
      renderFooter={() => (
        <>
          <Text>Don&apos;t have an account yet?</Text>
          <NextLink href="/register" passHref>
            <Link mt={1} color="blue.500">
              Register
            </Link>
          </NextLink>
        </>
      )}
    >
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
      <Checkbox
        isChecked={isRememberMe}
        onChange={() => setIsRememberMe((prev) => !prev)}
      >
        Remember me
      </Checkbox>
    </FormWrapper>
  );
};
