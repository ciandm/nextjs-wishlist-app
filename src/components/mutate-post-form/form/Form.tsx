import { MutatePostFormState } from '../MutatePostForm';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import {
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Textarea,
} from '@chakra-ui/react';
import CurrencyInput from 'react-currency-input-field';

export const Form = ({
  onSubmit,
}: {
  onSubmit: (data: MutatePostFormState) => void;
}) => {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext<MutatePostFormState>();

  const handleOnSubmit = handleSubmit(
    (data) => {
      if (!errors?.name && !errors?.price) {
        onSubmit(data);
      }
    },
    (errors) => console.log(errors)
  );

  const { description = '', price } = useWatch({ control });

  const {
    field: { value, ...restField },
  } = useController({
    name: 'isFavorite',
    control,
  });

  return (
    <Flex
      id="mutate-post-form"
      as="form"
      onSubmit={handleOnSubmit}
      flexDirection="column"
      gap={4}
    >
      <FormControl isInvalid={!!errors?.name}>
        <FormLabel>Title</FormLabel>
        <Input
          bg="white"
          borderColor="gray.300"
          {...register('name', {
            required: { value: true, message: 'This is required' },
            minLength: { value: 4, message: 'Minimum of 4 characters' },
            onBlur: (e) => setValue('name', e.target.value.trim()),
          })}
        />
        <FormErrorMessage>
          {errors?.name && errors?.name?.message}
        </FormErrorMessage>
      </FormControl>
      <Grid gap={4} templateColumns="repeat(auto-fit, minmax(240px, 1fr))">
        <FormControl isInvalid={!!errors?.price}>
          <FormLabel>Price</FormLabel>
          <InputGroup>
            <InputLeftAddon
              bg="gray.100"
              border="1px"
              borderColor="gray.300"
              color="gray.800"
            >
              €
            </InputLeftAddon>
            <Input
              decimalScale={2}
              maxLength={6}
              groupSeparator=","
              decimalSeparator="."
              allowNegativeValue={false}
              defaultValue={price}
              decimalsLimit={2}
              as={CurrencyInput}
              bg="white"
              borderColor="gray.300"
              {...register('price', {
                required: { value: true, message: 'This is required' },
                minLength: { value: 1, message: 'Minimum of 1' },
                maxLength: {
                  value: 6,
                  message: 'Maximum of 6 digits, including decimal',
                },
                onBlur: (e) => setValue('price', e.target.value.trim()),
              })}
              placeholder="29.99"
              type="string"
            />
          </InputGroup>
          <FormErrorMessage>
            {errors?.price && errors?.price?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors?.url}>
          <FormLabel>Link</FormLabel>
          <Input
            bg="white"
            borderColor="gray.300"
            placeholder="https://www.example.com/product/123"
            {...register('url', {
              required: {
                value: true,
                message: 'This is required',
              },
              pattern: {
                value:
                  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                message: 'Must be a valid url',
              },
              minLength: 1,
            })}
          />
          <FormErrorMessage>
            {errors?.url && errors?.url?.message}
          </FormErrorMessage>
        </FormControl>
      </Grid>
      <FormControl isInvalid={!!errors?.description}>
        <Flex justifyContent="space-between">
          <FormLabel>Description (optional)</FormLabel>
          <Text
            color={description?.trim().length > 100 ? 'red.500' : 'gray.500'}
            fontSize="sm"
          >
            {description?.trim().length}/100
          </Text>
        </Flex>
        <Textarea
          borderColor="gray.300"
          bg="white"
          placeholder="Enter the size, colour, alternative etc."
          {...register('description', {
            maxLength: {
              value: 100,
              message: 'Maximum 100 characters',
            },
            onBlur: (e) => setValue('description', e.target.value.trim()),
          })}
        />
        <FormHelperText></FormHelperText>
        <FormErrorMessage>
          {errors?.description && errors?.description?.message}
        </FormErrorMessage>
      </FormControl>
      <Checkbox isChecked={value} {...restField}>
        Mark as favourite
      </Checkbox>
    </Flex>
  );
};
