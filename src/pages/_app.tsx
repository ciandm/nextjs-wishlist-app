// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { Layout } from "../components/layout/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import {
  createBrowserSupabaseClient,
  Session,
} from "@supabase/auth-helpers-nextjs";

const App: AppType<{ initialSession: Session | null }> = ({
  Component,
  pageProps: { initialSession, ...pageProps },
}) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={initialSession}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionContextProvider>
      </ChakraProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
