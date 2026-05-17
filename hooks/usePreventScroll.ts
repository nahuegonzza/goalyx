import { useEffect } from 'react';

let scrollLockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';
let listenersAttached = false;

const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
};

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault();
};

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

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    listenersAttached = true;
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

    if (listenersAttached) {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
      listenersAttached = false;
    }
  }
};

/**
 * Hook que previene el scroll del body y cualquier interacción con el fondo
 * cuando un modal está abierto. Se restaura automáticamente cuando se desmonta.
 * Bloquea scroll por rueda y touch.
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
