import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useUpdateUser } from 'src/hooks/mutations/useUpdateUser';
import { useUser } from '@supabase/auth-helpers-react';

interface UpdateUserFormState {
  name: string;
}

export const UpdateUserForm = () => {
  const [isUpdateNameFormOpen, setIsUpdateNameFormOpen] = useState(false);

  const { control, handleSubmit } = useForm<UpdateUserFormState>();
  const { mutate: handleUpdateUser, isLoading } = useUpdateUser();

  useGetUser({
    onSuccess: ({ name }) => {
      if (!name) {
        setIsUpdateNameFormOpen(true);
      }
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    handleUpdateUser(data, {
      onSuccess: () => {
        setIsUpdateNameFormOpen(false);
      },
    });
  });

  return (
    <Modal
      isOpen={isUpdateNameFormOpen}
      onClose={() => false}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent as="form" my="auto" onSubmit={onSubmit}>
        <ModalHeader>Before you start, your name please.</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>First name</FormLabel>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input value={field.value} onChange={field.onChange} />
              )}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button isLoading={isLoading} type="submit">
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
