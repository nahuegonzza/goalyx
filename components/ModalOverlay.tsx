'use client';

import { usePreventScroll } from '@hooks/usePreventScroll';
import type { PropsWithChildren } from 'react';

interface ModalOverlayProps {
  open?: boolean;
  className?: string;
}

export default function ModalOverlay({
  open = true,
  className = 'flex items-center justify-center bg-black/50 backdrop-blur-md p-4',
  children,
}: PropsWithChildren<ModalOverlayProps>) {
  usePreventScroll(open);

  if (!open) return null;

  return (
    <div className={`fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[9999] ${className} pointer-events-auto`}>
      {children}
    </div>
  );
}
