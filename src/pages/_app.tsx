import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactElement, ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import {
  createBrowserSupabaseClient,
  Session,
} from '@supabase/auth-helpers-nextjs';
import { Database } from 'types/database.types';
import { theme } from 'src/theme/theme';
import { NextPage } from 'next';
import { Layout } from 'components/layout/Layout';
import { UserSetup } from 'components/user-setup/UserSetup';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ initialSession: Session | null }> & {
  Component: NextPageWithLayout;
};

const App = ({
  Component,
  pageProps: { initialSession, ...pageProps },
}: AppPropsWithLayout) => {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus:
            process.env.NODE_ENV !== 'development' ? 'always' : false,
          refetchOnMount: false,
          cacheTime: Infinity,
          staleTime: Infinity,
        },
      },
    })
  );

  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}
    >
      <UserSetup />
      <QueryClientProvider client={queryClient}>
        <ChakraProvider
          toastOptions={{
            defaultOptions: { position: 'top', isClosable: true },
          }}
          theme={theme}
        >
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;
