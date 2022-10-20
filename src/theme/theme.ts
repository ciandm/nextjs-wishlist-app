import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  components: {
    Checkbox: {
      baseStyle: {
        control: {
          bg: 'white',
        },
      },
    },
  },
});
