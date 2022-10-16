import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { trpc } from "src/utils/trpc";

interface WishlistDeleteConfirmPromptProps
  extends Omit<ModalProps, "children"> {
  wishlistId: string;
  onCancel: () => void;
}

export const WishlistDeleteConfirmPrompt = ({
  isOpen,
  onClose,
  onCancel,
  wishlistId,
}: WishlistDeleteConfirmPromptProps) => {
  const utils = trpc.useContext();
  const { mutate: handleDeleteWishlist, isLoading: isDeletingWishlist } =
    trpc.wishlist.deleteWishlist.useMutation({
      onSuccess: () => {
        onClose();
        utils.wishlist.getAllByUserId.invalidate();
      },
    });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={isDeletingWishlist ? false : true}
      closeOnOverlayClick={isDeletingWishlist ? false : true}
    >
      <ModalOverlay />
      <ModalContent placeContent="center" my="auto" mx={4}>
        <ModalHeader>
          <Text>Are you sure you want to delete this wishlist?</Text>
        </ModalHeader>
        <ModalBody>
          <Text>
            Deleting this wishlist will remove it forever, along with the data.
            This action cannot be undone.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onCancel}
            colorScheme="blue"
            variant="filled"
            isDisabled={isDeletingWishlist}
          >
            Cancel
          </Button>
          <Button
            isLoading={isDeletingWishlist}
            colorScheme="red"
            variant="ghost"
            onClick={() => handleDeleteWishlist({ id: wishlistId ?? "" })}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
