import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
} from '@chakra-ui/react';
import React from 'react';

interface ConfirmPromptProps extends Omit<ModalProps, 'children'> {
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const ConfirmPrompt = ({
  title,
  description,
  isLoading,
  isDisabled,
  onConfirm,
  onClose,
  ...props
}: ConfirmPromptProps) => {
  return (
    <Modal onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent placeContent='center' my='auto' mx={4}>
        <ModalHeader>
          <Text>{title}</Text>
        </ModalHeader>
        <ModalBody>
          <Text>{description}</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            colorScheme='blue'
            variant='filled'
            isDisabled={isDisabled}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            colorScheme='red'
            variant='ghost'
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
