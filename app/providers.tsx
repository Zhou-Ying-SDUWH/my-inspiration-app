'use client';

import { InsforgeProvider } from '@insforge/react';
import { insforge } from '@/config/insforge';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InsforgeProvider client={insforge}>
      {children}
    </InsforgeProvider>
  );
}