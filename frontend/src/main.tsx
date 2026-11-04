import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { SmoothScrollProvider } from './app/providers/SmoothScrollProvider';
import App from './App';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 mins
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SmoothScrollProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SmoothScrollProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
