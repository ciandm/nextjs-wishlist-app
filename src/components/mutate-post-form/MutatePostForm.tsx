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
import React, { useEffect, useState } from 'react';
import { useEditPost } from 'hooks/mutations/useEditPost';
import { StepOneForm } from './step-one-form/StepOneForm';
import { StepTwoForm } from './step-two-form/StepTwoForm';
import { FormProvider, useForm } from 'react-hook-form';

interface MutatePostFormPropsModal extends ModalProps {
  title: string;
  currentStep: number;
  renderFooter: () => React.ReactNode;
}

const FormDrawer = ({
  children,
  title,
  currentStep,
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
            {/* <Text>{isEditing ? 'Edit your post' : 'Add a post'}</Text> */}
            <Text>{title}</Text>
            <Text color="gray.500" fontSize="sm">
              {currentStep} / 2
            </Text>
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
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const { mutate: handleAddPost, isLoading: isLoadingAddPost } = useAddPost();
  const { mutate: handleEditPost, isLoading: isLoadingEditPost } =
    useEditPost();
  const toast = useToast();

  const isLoading = isLoadingAddPost || isLoadingEditPost;

  useEffect(() => {
    if (initialData) {
      setCurrentStep(1);
      reset({ ...initialData });
    }
  }, [initialData, reset]);

  function handleOnClose() {
    setCurrentStep(1);
    reset();
    onClose?.();
  }

  function handleStepOneSubmit() {
    setCurrentStep(2);
  }

  function handleStepTwoSubmit({
    isFavorite,
    ...passedData
  }: MutatePostFormState) {
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
    currentStep,
    isEditing,
    setCurrentStep,
  };

  const contentComponent = (
    <FormProvider reset={reset} {...restMethods}>
      <MutatePostFormContent
        handleStepOneSubmit={handleStepOneSubmit}
        handleStepTwoSubmit={handleStepTwoSubmit}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
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
        currentStep={currentStep}
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
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  handleStepOneSubmit: () => void;
  handleStepTwoSubmit: (data: MutatePostFormState) => void;
}

export const MutatePostFormContent = ({
  renderFooter,
  currentStep,
  handleStepOneSubmit,
  handleStepTwoSubmit,
}: MutatePostFormContentProps) => {
  return (
    <>
      <Flex flexDirection="column" gap={2} pb={4}>
        {currentStep === 1 ? (
          <StepOneForm handleStepOneSubmit={handleStepOneSubmit} />
        ) : (
          <StepTwoForm onSubmit={(data) => handleStepTwoSubmit(data)} />
        )}
      </Flex>
      {renderFooter()}
    </>
  );
};

interface FormActionsProps {
  isLoading: boolean;
  onClose?: () => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  currentStep: number;
  isEditing: boolean;
}

const FormActions = ({
  isLoading,
  onClose,
  currentStep,
  setCurrentStep,
}: FormActionsProps) => (
  <Flex flex={1} alignItems="center" justifyContent="space-between">
    {currentStep === 2 && (
      <Button
        isDisabled={isLoading}
        onClick={() => setCurrentStep(1)}
        mr="auto"
        colorScheme="gray"
        size="sm"
        variant="link"
      >
        Back
      </Button>
    )}
    <Flex ml="auto" gap={4}>
      {onClose && (
        <Button variant="link" onClick={onClose} isDisabled={isLoading}>
          Cancel
        </Button>
      )}
      <Button
        isLoading={isLoading}
        type="submit"
        form={currentStep === 1 ? 'step-one' : 'step-two'}
        colorScheme="blue"
      >
        {currentStep === 1 ? 'Next' : 'Confirm'}
      </Button>
    </Flex>
  </Flex>
);
