import { MutatePostFormState } from '../MutatePostForm';
import { useFormContext } from 'react-hook-form';
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';

export const StepOneForm = ({
  handleStepOneSubmit,
}: {
  handleStepOneSubmit: () => void;
}) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext<MutatePostFormState>();

  const handleOnSubmit = handleSubmit(
    () => {
      console.log('hello');
      if (!errors?.name && !errors?.price) {
        handleStepOneSubmit();
      }
    },
    (errors) => console.log(errors)
  );

  return (
    <Flex
      id="step-one"
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
      <FormControl isInvalid={!!errors?.price}>
        <Flex mb={2} justifyContent="space-between" alignItems="center">
          <FormLabel mb={0}>Price</FormLabel>
          <FormHelperText mt={0}>Price in euro rounded</FormHelperText>
        </Flex>
        <InputGroup>
          <InputLeftAddon bg="gray.300" color="gray.800">
            €
          </InputLeftAddon>
          <Input
            bg="white"
            borderColor="gray.300"
            {...register('price', {
              pattern: {
                value: /[0-9]*\.?[0-9]*/,
                message: 'Only numbers are allowed',
              },
              required: { value: true, message: 'This is required' },
              minLength: { value: 1, message: 'Minimum of 1' },
              onBlur: (e) => setValue('price', e.target.value.trim()),
            })}
            type="number"
          />
        </InputGroup>
        <FormErrorMessage>
          {errors?.price && errors?.price?.message}
        </FormErrorMessage>
      </FormControl>
    </Flex>
  );
};
