import { useEffect } from 'react';

/**
 * Hook que previene el scroll del body y cualquier interacción con el fondo
 * cuando un modal está abierto. Se restaura automáticamente cuando se desmonta.
 * Bloquea scroll por rueda, touch, teclado y desplazamiento.
 */
export function usePreventScroll(isOpen: boolean = true) {
  useEffect(() => {
    if (!isOpen) return;

    // Guardar el scroll actual
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Prevenir scroll y agregar padding para compensar la scrollbar que desaparece
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Prevenir scroll con rueda del mouse
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    // Prevenir scroll con touch
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    // Agregar event listeners al documento
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Cleanup: restaurar estilos originales y remover listeners
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen]);
}
