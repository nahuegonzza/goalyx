'use client';

import { useState } from 'react';
import { usePreventScroll } from '@hooks/usePreventScroll';
import ModalOverlay from '@components/ModalOverlay';
import GoalForm from '@components/GoalForm';
import UnsavedChangesModal from '@components/UnsavedChangesModal';

interface GoalCreateModalProps {
  onClose: () => void;
  onCreateSuccess: () => void;
}

export default function GoalCreateModal({ onClose, onCreateSuccess }: GoalCreateModalProps) {
  usePreventScroll();
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const handleClose = () => {
    if (!isDirty) {
      onClose();
      return;
    }
    setShowUnsavedDialog(true);
  };

  return (
    <ModalOverlay variant="end" opacity="60" blur="sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xl transition-all pointer-events-auto">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">🎯 Nuevo objetivo</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Crea un objetivo sin salir de la página y mantén tu flujo visual consistente.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <GoalForm
          submitLabel="Crear objetivo"
          onSubmit={async (payload) => {
            try {
              const response = await fetch('/api/goals', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });

              if (response.ok) {
                return { success: true, message: 'Objetivo creado con éxito' };
              }

              const body = await response.json().catch(() => null);
              return { success: false, message: body?.error || body?.message || 'No se pudo crear el objetivo' };
            } catch (error) {
              return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
            }
          }}
          onSuccess={onCreateSuccess}
          onCancel={onClose}
          onDirtyChange={setIsDirty}
        />

        <UnsavedChangesModal
          open={showUnsavedDialog}
          onKeepEditing={() => setShowUnsavedDialog(false)}
          onDiscard={() => {
            setShowUnsavedDialog(false);
            onClose();
          }}
        />
      </div>
    </ModalOverlay>
  );
}
