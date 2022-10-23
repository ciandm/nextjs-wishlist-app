import { useUser } from '@supabase/auth-helpers-react';
import { useForm, useWatch } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { useCreateWishlist } from 'src/hooks/mutations/useCreateWishlist';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  chakra,
  Text,
  IconButton,
  Icon,
  FormErrorMessage,
  Flex,
  Box,
  DrawerHeader,
} from '@chakra-ui/react';
import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { IoRemove } from 'react-icons/io5';
import { useToast } from 'hooks/useToast';

interface CreateWishlistFormState {
  name: string;
  users: { email: string }[];
}

export const CreateWishlistForm = ({
  initialState = { users: [{ email: '' }], name: '' },
}: {
  initialState?: CreateWishlistFormState;
}) => {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    register,
    reset,
  } = useForm<CreateWishlistFormState>({
    defaultValues: { ...initialState },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users',
    rules: {
      minLength: 1,
    },
  });
  const toast = useToast();

  const { users } = useWatch({ control });

  const { mutate: handleCreateWishlist, isLoading: isCreatingWishlist } =
    useCreateWishlist();

  const onSubmit = handleSubmit((data) => {
    if (data.users.find((u) => u.email === user?.email)) {
      toast({
        title: 'You are already in the list.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    const wishlistUsers = [
      { email: user?.email ?? '' },
      ...data.users.map((user) => ({ email: user.email })),
    ];
    handleCreateWishlist(
      {
        name: data.name,
        users: wishlistUsers,
      },
      {
        onSuccess: () => {
          reset();
          setIsOpen(false);
          toast({
            title: 'Wishlist created',
            status: 'success',
            description: `Wishlist created successfully with ${wishlistUsers?.length} users`,
          });
        },
        onError: (error) => {
          if (error instanceof Error) {
            toast({
              title: 'Something went wrong',
              description: error.message,
              status: 'error',
            });
          }
        },
      }
    );
  });

  const handleOnClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <>
      <chakra.div w="full">
        <Button
          className="mt-auto"
          colorScheme="blue"
          onClick={() => setIsOpen(true)}
          w="full"
        >
          Create a new wishlist
        </Button>
      </chakra.div>
      <Drawer isOpen={isOpen} onClose={handleOnClose} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Add a wishlist</DrawerHeader>
          <DrawerBody
            as="form"
            display="flex"
            flexDirection="column"
            p={0}
            onSubmit={onSubmit}
          >
            <DrawerCloseButton />
            <Box overflowY="auto" p={4} flex={1}>
              <FormControl isInvalid={!!errors.name} label="Name">
                <FormLabel>Name</FormLabel>
                <Input
                  {...register('name', {
                    required: 'This is required',
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
                    onBlur: (e) => setValue('name', e.target.value.trim()),
                  })}
                  placeholder="Enter a name for your wishlist"
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <chakra.div
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                pt={4}
                mb={2}
              >
                <Text>Add others</Text>
              </chakra.div>
              <Flex flexDirection="column" gap={2}>
                {fields.map((field, index) => (
                  <Flex key={field.id}>
                    <Flex
                      gap={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormControl isInvalid={!!errors.users} label="Name">
                        <Input
                          {...register(`users.${index}.email` as const, {
                            required: 'This is required',
                            minLength: {
                              value: 4,
                              message: 'Minimum length should be 4',
                            },
                            onBlur: (e) =>
                              setValue(
                                `users.${index}.email`,
                                e.target.value.trim()
                              ),
                          })}
                          type="email"
                          placeholder="Enter email address"
                        />
                      </FormControl>
                      <IconButton
                        isDisabled={fields.length === 1}
                        onClick={() => remove(index)}
                        aria-label="Remove"
                      >
                        <Icon as={IoRemove} />
                      </IconButton>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
              <Button
                w="full"
                mt={4}
                isDisabled={users?.some(({ email }) => email === '')}
                onClick={() => append({ email: '' })}
                aria-label="Add others"
                colorScheme="green"
                variant="ghost"
              >
                <Icon as={IoAdd} />
                Add another
              </Button>
            </Box>
            <Box p={4} borderTop="1px" borderColor="gray.200">
              <Button
                mt="auto"
                isLoading={isCreatingWishlist}
                type="submit"
                w="full"
                colorScheme="blue"
              >
                Create wishlist
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
