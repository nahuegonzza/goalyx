import { useEffect } from 'react';

let scrollLockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

const attachScrollLock = () => {
  if (typeof document === 'undefined') return;
  if (scrollLockCount === 0) {
    originalOverflow = document.body.style.overflow;
    originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  scrollLockCount += 1;
};

const releaseScrollLock = () => {
  if (typeof document === 'undefined') return;
  if (scrollLockCount <= 0) return;

  scrollLockCount -= 1;
  if (scrollLockCount === 0) {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  }
};

/**
 * Hook que previene el scroll del body cuando un modal está abierto.
 * Se restaura automáticamente cuando se desmonta y permite scroll interno en el modal.
 */
export function usePreventScroll(isOpen: boolean = false) {
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    attachScrollLock();
    return () => {
      releaseScrollLock();
    };
  }, [isOpen]);
}
