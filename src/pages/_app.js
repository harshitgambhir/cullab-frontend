import '../styles/globals.css';
import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import { initPusher } from '../utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      refetchOnMount: false,
      cacheTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

function Wrapper({ children }) {
  const _queryClient = useQueryClient();

  useEffect(() => {
    initPusher(_queryClient);
  }, []);

  return children;
}

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Wrapper>
        <audio id='chatAudio' src='/sounds/notification.mp3' />
        <Toaster />
        <Component {...pageProps} />
      </Wrapper>
    </QueryClientProvider>
  );
}

export default MyApp;
