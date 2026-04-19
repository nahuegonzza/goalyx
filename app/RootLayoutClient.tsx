'use client';

import { ThemeProvider } from '@lib/ThemeProvider';
import ServiceWorkerRegister from '@components/ServiceWorkerRegister';
import { SessionProvider } from 'next-auth/react';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ServiceWorkerRegister />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}