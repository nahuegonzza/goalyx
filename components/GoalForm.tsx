'use client';

import { useState } from 'react';
import type { GoalPayload } from '@types';
import { ICON_OPTIONS, COLOR_OPTIONS, getGoalIcon } from '@lib/goalIconsColors';
import NumberInput from '@components/NumberInput';

interface GoalFormProps {
  onSuccess?: () => void;
}

interface GoalFormData extends GoalPayload {
  icon?: string;
  color?: string;
}

const initialState: GoalFormData = {
  title: '',
  description: '',
  type: 'BOOLEAN',
  icon: 'star',
  color: 'slate',
  pointsIfTrue: 1,
  pointsIfFalse: 0,
  pointsPerUnit: 1
};

export default function GoalForm({ onSuccess }: GoalFormProps) {
  const [form, setForm] = useState<GoalFormData>(initialState);
  const [status, setStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Guardando objetivo...');
    setStatusType('success');

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setForm(initialState);
        setStatus('✓ Objetivo creado con éxito');
        setStatusType('success');
        setShowIconPicker(false);
        setShowColorPicker(false);
        setTimeout(() => setStatus(''), 3000);
        onSuccess?.();
        return;
      }

      const body = await response.json().catch(() => null);
      const message = body?.error || body?.message || '✗ No se pudo crear el objetivo';
      setStatus(message);
      setStatusType('error');
    } catch (error) {
      setStatus(error instanceof Error ? `Error: ${error.message}` : 'Error desconocido');
      setStatusType('error');
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre</label>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-slate-900 dark:text-white outline-none transition focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej. Leer 20 minutos"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo</label>
          <select
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value as GoalFormData['type'] })}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-slate-900 dark:text-white outline-none transition focus:ring-2 focus:ring-emerald-500"
          >
            <option value="BOOLEAN">Hábito (Sí/No)</option>
            <option value="NUMERIC">Métrica (Número)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Descripción</label>
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-slate-900 dark:text-white outline-none transition focus:ring-2 focus:ring-emerald-500"
          placeholder="Detalles (opcional)"
          rows={2}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Icono</label>
          <button
            type="button"
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {getGoalIcon(form.icon ?? 'star')}
          </button>
          {showIconPicker && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 grid grid-cols-5 gap-2 z-20">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, icon: opt.key });
                    setShowIconPicker(false);
                  }}
                  className="text-2xl p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
                  title={opt.label}
                >
                  {opt.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Color</label>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-3 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div 
              className="w-6 h-6 rounded-full border-2"
              style={{
                backgroundColor: COLOR_OPTIONS.find(opt => opt.key === form.color)?.bgColor || COLOR_OPTIONS[0].bgColor,
                borderColor: COLOR_OPTIONS.find(opt => opt.key === form.color)?.borderColor || COLOR_OPTIONS[0].borderColor
              }}
            />
            <span>{(form.color ? form.color.charAt(0).toUpperCase() + form.color.slice(1) : 'Slate')}</span>
          </button>
          {showColorPicker && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3 grid grid-cols-6 gap-3 z-20 max-h-48 overflow-y-auto">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, color: opt.key });
                    setShowColorPicker(false);
                  }}
                  className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 focus:outline-none"
                  style={{
                    backgroundColor: opt.bgColor,
                    borderColor: opt.borderColor,
                    boxShadow: form.color === opt.key ? `0 0 0 3px rgb(16 185 129 / 0.5)` : 'none',
                    opacity: form.color === opt.key ? 1 : 0.7
                  }}
                  title={opt.label}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    if (form.color !== opt.key) {
                      target.style.opacity = '0.7';
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {form.type === 'BOOLEAN' ? 'Puntos si ✔' : 'Puntos por unidad'}
            </label>
            <NumberInput
              value={form.type === 'BOOLEAN' ? form.pointsIfTrue ?? 1 : form.pointsPerUnit ?? 1}
              onCommit={(value) =>
                setForm({
                  ...form,
                  ...(form.type === 'BOOLEAN'
                    ? { pointsIfTrue: value }
                    : { pointsPerUnit: value })
                })
              }
              ariaLabel={form.type === 'BOOLEAN' ? 'Puntos si verdadero' : 'Puntos por unidad'}
            />
          </div>

          {form.type === 'BOOLEAN' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Puntos si ✖
              </label>
              <NumberInput
                value={form.pointsIfFalse ?? 0}
                onCommit={(value) => setForm({ ...form, pointsIfFalse: value })}
                ariaLabel="Puntos si falso"
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-emerald-600 dark:bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 dark:hover:bg-emerald-700 transition"
      >
        Crear Objetivo
      </button>

      {status && (
        <p
          className={`text-sm font-medium ${
            statusType === 'success'
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-red-700 dark:text-red-300'
          }`}
        >
          {status}
        </p>
      )}
    </form>
  );
}
