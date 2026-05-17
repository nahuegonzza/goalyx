'use client';

import { usePreventScroll } from '@hooks/usePreventScroll';

interface InfoModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onClose: () => void;
}

export default function InfoModal({
  open,
  title,
  description,
  confirmLabel = 'Entendido',
  onClose,
}: InfoModalProps) {
  usePreventScroll(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 pointer-events-auto">
      <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-2xl shadow-slate-900/20 pointer-events-auto">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
