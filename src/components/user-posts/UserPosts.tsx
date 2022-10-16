import React from 'react';
import { useGetUser } from 'src/hooks/queries/useGetUser';
import { useGetWishlistPosts } from 'hooks/queries/useGetWishlistPosts';
import {
  Button,
  chakra,
  Heading,
  Flex,
  Text,
  Skeleton,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { WishlistPost } from 'components/wishlist-post/WishlistPost';
import { useState } from 'react';
import {
  MutatePostForm,
  MutatePostFormState,
} from 'components/mutate-post-form/MutatePostForm';
import { Post } from 'types/utils';

export const UserPosts = ({ wishlistId }: { wishlistId: string }) => {
  const { data: user } = useGetUser();
  const {
    data: posts = [],
    isLoading = true,
    isFetching,
    status,
  } = useGetWishlistPosts(wishlistId);

  const usersPosts = posts.filter((post) => post.created_by === user?.id);

  const hasPosts = usersPosts.length > 0 && status === 'success';
  const hasNoPosts = usersPosts.length === 0 && status === 'success';

  return (
    <chakra.div display="flex" flexDirection="column" gap={4}>
      <PostsContainer
        isFetching={isFetching}
        hasPosts={hasPosts}
        isLoading={isLoading}
        usersPosts={usersPosts}
        wishlistId={wishlistId}
      />
      {hasNoPosts && !isFetching && (
        <Flex flexDirection="column">
          <Flex flexDirection="column" gap={2} mb={4}>
            <Heading fontSize="2xl">Add your first item</Heading>
            <Text fontSize="sm">
              Add your first item so others can claim them. You will not be able
              to see what items have been claimed or by who, so be sure to
              favourite items that you really want.
            </Text>
          </Flex>
          <MutatePostForm wishlistId={wishlistId} />
        </Flex>
      )}
    </chakra.div>
  );
};

interface PostsContainerProps {
  usersPosts: ReturnType<typeof useGetWishlistPosts>['data'];
  wishlistId: string;
  isLoading: boolean;
  hasPosts: boolean;
  isFetching: boolean;
}

const PostsContainer = ({
  usersPosts = [],
  wishlistId,
  isLoading,
  hasPosts,
  isFetching,
}: PostsContainerProps) => {
  const [editingPostId, setEditingPostId] = useState<string | undefined>(
    undefined
  );
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);

  const [initialData, setInitialData] = useState<
    MutatePostFormState | undefined
  >(undefined);

  const handleOnEdit = ({
    description,
    id,
    name,
    url,
    price,
  }: Pick<Post, 'description' | 'name' | 'url' | 'price' | 'id'>) => {
    setEditingPostId(id);
    setInitialData({
      description: description ?? '',
      name: name ?? '',
      url: url ?? '',
      price: price ?? '',
      isFavorite: false,
    });
    setIsAddPostOpen(true);
  };

  function handleOnClose() {
    setEditingPostId(undefined);
    setInitialData({
      description: '',
      name: '',
      price: '',
      url: '',
      isFavorite: false,
    });
    setIsAddPostOpen(false);
  }

  const mutatePostFormProps = {
    onClose: handleOnClose,
    isOpen: isAddPostOpen,
    isEditing: !!editingPostId,
    initialData,
    wishlistId,
    postId: editingPostId,
  };

  if (!hasPosts && !isFetching) {
    return null;
  }

  const posts = isLoading
    ? (Array(2).fill(null) as Post[])
    : (usersPosts as Post[]);

  return (
    <>
      <Skeleton isLoaded={!isLoading}>
        <Button
          w="full"
          onClick={() => setIsAddPostOpen(true)}
          variant="solid"
          colorScheme="blue"
        >
          Add post
        </Button>
      </Skeleton>
      {!isLoading && isFetching && <Spinner mx="auto" my={3} />}
      <Box
        display={['flex', null, hasPosts ? 'grid' : 'flex']}
        flexWrap="wrap"
        gap={4}
        gridTemplateColumns={[null, null, hasPosts ? '1fr 1fr' : null]}
      >
        {posts.map((post, index) => (
          <WishlistPost
            onEdit={handleOnEdit}
            key={post?.id ? post.id : index}
            wishlistId={wishlistId}
            isLoading={isLoading}
            {...post}
          />
        ))}
      </Box>
      <MutatePostForm {...mutatePostFormProps} type="modal" />
    </>
  );
};
