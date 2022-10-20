import { MutatePostFormState } from '../MutatePostForm';
import { useWatch, useFormContext, useController } from 'react-hook-form';
import {
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';

export const StepTwoForm = ({
  onSubmit,
}: {
  onSubmit: (data: MutatePostFormState) => void;
}) => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useFormContext<MutatePostFormState>();

  const { description = '' } = useWatch({ control });

  const handleOnSubmit = handleSubmit((data) => {
    if (!errors?.description && !errors?.url) {
      onSubmit(data);
    }
  });

  const {
    field: { value, ...restField },
  } = useController({
    name: 'isFavorite',
    control,
  });

  return (
    <Flex
      id="step-two"
      as="form"
      onSubmit={handleOnSubmit}
      flexDirection="column"
      gap={2}
    >
      <FormControl isInvalid={!!errors?.url}>
        <FormLabel>Link</FormLabel>
        <Input
          bg="white"
          borderColor="gray.300"
          {...register('url', {
            required: {
              value: true,
              message: 'This is required',
            },
            minLength: 1,
          })}
        />
        <FormErrorMessage>
          {errors?.url && errors?.url?.message}
        </FormErrorMessage>
      </FormControl>
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
