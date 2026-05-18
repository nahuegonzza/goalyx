'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalOverlayProps {
  children: ReactNode;
  variant?: 'center' | 'end';
  blur?: 'sm' | 'md';
  opacity?: '50' | '60';
  className?: string;
}

export default function ModalOverlay({
  children,
  variant = 'center',
  blur = 'sm',
  opacity = '60',
  className = '',
}: ModalOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const overlayClassName = useMemo(() => {
    const alignment = variant === 'end'
      ? 'items-end sm:items-center justify-center'
      : 'items-center justify-center';

    const blurClass = blur === 'md' ? 'backdrop-blur-md' : 'backdrop-blur-sm';
    const opacityClass = opacity === '50' ? 'bg-black/50' : 'bg-black/60';

    return [
      'fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-40',
      'flex',
      'pointer-events-auto',
      alignment,
      opacityClass,
      blurClass,
      'p-0 sm:p-4',
      className,
    ].filter(Boolean).join(' ');
  }, [variant, blur, opacity, className]);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={overlayClassName}>
      {children}
    </div>,
    document.body,
  );
}
