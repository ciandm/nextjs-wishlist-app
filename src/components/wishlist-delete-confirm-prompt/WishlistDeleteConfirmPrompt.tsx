import { ModalProps, useToast } from '@chakra-ui/react';
import { ConfirmPrompt } from 'components/confirm-prompt/ConfirmPrompt';
import React from 'react';
import { useDeleteWishlist } from 'src/hooks/mutations/useDeleteWishlist';

interface WishlistDeleteConfirmPromptProps
  extends Omit<ModalProps, 'children'> {
  wishlist_id: string;
  onCancel: () => void;
}

export const WishlistDeleteConfirmPrompt = ({
  isOpen,
  onClose,
  wishlist_id,
}: WishlistDeleteConfirmPromptProps) => {
  const { mutate: handleDeleteWishlist, isLoading: isDeletingWishlist } =
    useDeleteWishlist();
  const toast = useToast();

  return (
    <ConfirmPrompt
      title="Are you sure you want to delete this wishlist?"
      description="Deleting this wishlist will remove it forever, along with the data. This action cannot be undone."
      onConfirm={() =>
        handleDeleteWishlist(
          { id: wishlist_id ?? '' },
          {
            onSuccess: () => {
              toast({
                title: 'Wishlist deleted',
                description: 'The wishlist has been deleted successfully',
                status: 'success',
                position: 'top',
              });
            },
          }
        )
      }
      isLoading={isDeletingWishlist}
      isDisabled={isDeletingWishlist}
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={isDeletingWishlist ? false : true}
      closeOnOverlayClick={isDeletingWishlist ? false : true}
    />
  );
};
