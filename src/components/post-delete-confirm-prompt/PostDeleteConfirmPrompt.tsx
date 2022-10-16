import { ModalProps, useToast } from '@chakra-ui/react';
import { ConfirmPrompt } from 'components/confirm-prompt/ConfirmPrompt';
import React from 'react';
import { useDeletePost } from 'src/hooks/mutations/useDeletePost';

interface PostDeleteConfirmPromptProps extends Omit<ModalProps, 'children'> {
  wishlistId: string;
  postId: string;
  onCancel: () => void;
}

export const PostDeleteConfirmPrompt = ({
  isOpen,
  onClose,
  postId,
  wishlistId,
}: PostDeleteConfirmPromptProps) => {
  const { mutate: handleDeleteWishlist, isLoading: isDeletingWishlist } =
    useDeletePost();
  const toast = useToast();

  return (
    <ConfirmPrompt
      title='Are you sure you want to delete this post?'
      description='Deleting this post will remove it forever, along with the data and any claims it may have by other users. This action cannot be undone.'
      onConfirm={() =>
        handleDeleteWishlist(
          { postId, wishlistId },
          {
            onSuccess: () => {
              toast({
                title: 'Post deleted',
                description: 'The post has been deleted',
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
