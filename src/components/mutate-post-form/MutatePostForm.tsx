import {
  Button,
  Flex,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Text,
  useToast,
  ModalProps,
} from '@chakra-ui/react';
import { useAddPost } from 'hooks/mutations/useAddPost';
import React, { useEffect } from 'react';
import { useEditPost } from 'hooks/mutations/useEditPost';
import { Form } from './form/Form';
import { FormProvider, useForm } from 'react-hook-form';

interface MutatePostFormPropsModal extends ModalProps {
  title: string;
  renderFooter: () => React.ReactNode;
}

const FormDrawer = ({
  children,
  title,
  isOpen,
  renderFooter,
  ...rest
}: MutatePostFormPropsModal) => {
  return (
    <Drawer isOpen={isOpen} placement="right" {...rest}>
      <DrawerOverlay />
      <DrawerCloseButton />
      <DrawerContent overflow="hidden">
        <DrawerHeader pb={2}>
          <Flex alignItems="center" justifyContent="space-between">
            <Text>{title}</Text>
          </Flex>
        </DrawerHeader>
        <DrawerBody pt={4} pb={8}>
          {children}
        </DrawerBody>
        <DrawerFooter bg="gray.200" gap={4}>
          {renderFooter()}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export interface MutatePostFormState {
  name: string;
  price: string;
  url: string;
  description: string;
  isFavorite: boolean;
}

interface MutatePostFormProps {
  onClose?: () => void;
  isOpen?: boolean;
  wishlist_id: string;
  initialData?: MutatePostFormState;
  isEditing?: boolean;
  post_id?: string;
  type?: 'modal' | 'default';
}

export const MutatePostForm = ({
  isEditing = false,
  initialData,
  wishlist_id,
  post_id,
  type = 'default',
  isOpen,
  onClose,
}: MutatePostFormProps) => {
  const { reset, ...restMethods } = useForm<MutatePostFormState>({
    defaultValues: {
      ...initialData,
    },
  });
  const { mutate: handleAddPost, isLoading: isLoadingAddPost } = useAddPost();
  const { mutate: handleEditPost, isLoading: isLoadingEditPost } =
    useEditPost();
  const toast = useToast();

  const isLoading = isLoadingAddPost || isLoadingEditPost;

  useEffect(() => {
    if (initialData) {
      reset({ ...initialData });
    }
  }, [initialData, reset]);

  function handleOnClose() {
    reset();
    onClose?.();
  }

  function handleSubmit({ isFavorite, ...passedData }: MutatePostFormState) {
    if (isEditing) {
      handleEditPost(
        {
          ...passedData,
          is_favorited: isFavorite,
          id: post_id ?? '',
          wishlist_id,
        },
        {
          onSuccess: () => {
            handleOnClose();
            toast({
              position: 'top',
              title: 'Post edited',
              status: 'success',
              description: 'Post edited successfully.',
            });
          },
        }
      );

      return;
    }

    handleAddPost(
      { ...passedData, is_favorited: isFavorite, wishlist_id },
      {
        onSuccess: () => {
          handleOnClose();
          toast({
            position: 'top',
            title: 'Post added',
            status: 'success',
            description: 'Post added successfully.',
          });
        },
      }
    );
  }

  const formActionsProps = {
    isLoading,
    isEditing,
  };

  const contentComponent = (
    <FormProvider reset={reset} {...restMethods}>
      <MutatePostFormContent
        onSubmit={handleSubmit}
        renderFooter={() =>
          type === 'default' && <FormActions {...formActionsProps} />
        }
      />
    </FormProvider>
  );

  if (type === 'modal') {
    return (
      <FormDrawer
        title={isEditing ? 'Edit your post' : 'Add a post'}
        onClose={onClose ?? (() => true)}
        isOpen={!!isOpen}
        closeOnOverlayClick={isLoading ? false : true}
        closeOnEsc={isLoading ? false : true}
        renderFooter={() => (
          <FormActions onClose={handleOnClose} {...formActionsProps} />
        )}
      >
        {contentComponent}
      </FormDrawer>
    );
  }

  return contentComponent;
};

interface MutatePostFormContentProps {
  renderFooter: () => React.ReactNode;
  onSubmit: (data: MutatePostFormState) => void;
}

export const MutatePostFormContent = ({
  renderFooter,
  onSubmit,
}: MutatePostFormContentProps) => {
  return (
    <>
      <Flex flexDirection="column" gap={2} pb={4}>
        <Form onSubmit={onSubmit} />
      </Flex>
      {renderFooter()}
    </>
  );
};

interface FormActionsProps {
  isLoading: boolean;
  onClose?: () => void;
  isEditing: boolean;
}

const FormActions = ({ isLoading, onClose }: FormActionsProps) => (
  <Flex flex={1} alignItems="center" justifyContent="space-between">
    <Flex ml="auto" gap={4}>
      {onClose && (
        <Button variant="link" onClick={onClose} isDisabled={isLoading}>
          Cancel
        </Button>
      )}
      <Button
        isLoading={isLoading}
        type="submit"
        form="mutate-post-form"
        colorScheme="blue"
      >
        Confirm
      </Button>
    </Flex>
  </Flex>
);
