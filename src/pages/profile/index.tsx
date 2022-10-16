import { NextPage } from "next";
import React, { useState } from "react";
import { useUser } from "@/hooks/use-user/useUser";
import { trpc } from "@/utils/trpc";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Heading,
  Text,
  chakra,
  Input,
  FormControl,
  FormLabel,
  DrawerCloseButton,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { WishlistEntryCard } from "@/components/wishlist-entry-card/WishlistEntryCard";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { IoAdd, IoRemove } from "react-icons/io5";

const Profile: NextPage = () => {
  const { user } = useUser();

  const { data: wishlists = [], isLoading: isLoadingWishlists } =
    trpc.wishlist.getAllByUserId.useQuery(
      { userId: user?.id ?? "" },
      { enabled: !!user?.id, refetchOnWindowFocus: false }
    );

  const wishlistsToShow = (
    isLoadingWishlists ? Array(3).fill(null) : wishlists
  ) as Wishlist[];

  return (
    <>
      {/* <Avatar src={userData?.image ?? ""} /> */}
      <Heading fontSize="xl">Your wishlists</Heading>
      <CreateWishlistDrawer />
      <chakra.ul display="flex" flexDirection="column" gap={4}>
        {wishlistsToShow?.map((wishlist, index) => (
          <WishlistEntryCard
            key={wishlist?.id ?? index}
            name={wishlist?.name}
            isAdmin={!!(wishlist?.createdBy === user?.id)}
            id={wishlist?.id}
            isLoading={isLoadingWishlists}
          />
        ))}
      </chakra.ul>
    </>
  );
};

interface CreateWishlistFormState {
  name: string;
  users: { name: string }[];
}

const CreateWishlistDrawer = () => {
  const utils = trpc.useContext();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { handleSubmit, control, reset, resetField } =
    useForm<CreateWishlistFormState>({
      defaultValues: { users: [{ name: "" }] },
    });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "users",
    }
  );

  const { mutate: handleCreateWishlist, isLoading: isCreatingWishlist } =
    trpc.wishlist.createWishlist.useMutation({
      onSuccess: () => {
        setIsOpen(false);
        utils.wishlist.getAllByUserId.invalidate();
      },
    });

  const onSubmit = handleSubmit((data) => {
    handleCreateWishlist({ userId: user?.id ?? "", name: data.name });
    reset({ name: "", users: [{ name: "" }] });
  });

  const onClose = () => {
    setIsOpen(false);
    reset({ name: "", users: [{ name: "" }] });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create wishlist</Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody as="form" px={4} py={8} onSubmit={onSubmit}>
            <DrawerCloseButton />
            <chakra.div>
              <Controller
                name="name"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl label="Name">
                    <FormLabel>Name</FormLabel>
                    <Input
                      onChange={onChange}
                      value={value}
                      placeholder="Enter a name for your wishlist"
                    />
                  </FormControl>
                )}
              />
              <chakra.div
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                pt={4}
                mb={2}
              >
                <Text>Add others</Text>
                <IconButton
                  onClick={() => append({ name: "" })}
                  aria-label="Add others"
                  colorScheme="blue"
                >
                  <Icon as={IoAdd} />
                </IconButton>
              </chakra.div>
              <chakra.ul display="flex" flexDirection="column" gap={2}>
                {fields.map((field, index) => (
                  <chakra.li key={field.id}>
                    <chakra.div
                      gap={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Controller
                        name={`users.${index}.name` as const}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControl label="Name">
                            <Input
                              onChange={onChange}
                              value={value}
                              placeholder="Add user"
                            />
                          </FormControl>
                        )}
                      />
                      <IconButton
                        isDisabled={fields.length === 1}
                        onClick={() => remove(index)}
                        aria-label="Remove"
                        colorScheme="red"
                        variant="ghost"
                      >
                        <Icon as={IoRemove} />
                      </IconButton>
                    </chakra.div>
                  </chakra.li>
                ))}
              </chakra.ul>
            </chakra.div>
            <Button
              isLoading={isCreatingWishlist}
              type="submit"
              mt={8}
              w="full"
              colorScheme="green"
            >
              Create wishlist
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Profile;
