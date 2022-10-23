import { useToast as _useToast, UseToastOptions } from '@chakra-ui/react';

export const useToast = (props: UseToastOptions) => {
  return _useToast({ position: 'top-right', ...props });
};
