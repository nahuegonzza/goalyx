'use client';

import { useState } from 'react';
import type { ModuleDefinition } from '@types';

interface EventFormProps {
  modules: readonly ModuleDefinition[];
}

const initialState = {
  type: '',
  value: 0,
  moduleSlug: 'core',
  metadata: '{}'
};

export default function EventForm({ modules }: EventFormProps) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<string>('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Registrando evento...');

    const response = await fetch('/api/events', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: form.type,
        value: Number(form.value),
        moduleSlug: form.moduleSlug,
        metadata: form.metadata ? JSON.parse(form.metadata) : {}
      })
    });

    if (response.ok) {
      setForm(initialState);
      setStatus('Evento registrado con éxito. Refresca para ver el score.');
    } else {
      setStatus('No se pudo registrar el evento. Revisa el payload.');
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Tipo de evento</label>
        <input
          value={form.type}
          onChange={(event) => setForm({ ...form, type: event.target.value })}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
          placeholder="Ej. horas_sueno"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Valor</label>
        <input
          type="number"
          step="0.1"
          value={form.value}
          onChange={(event) => setForm({ ...form, value: Number(event.target.value) })}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Módulo</label>
        <select
          value={form.moduleSlug}
          onChange={(event) => setForm({ ...form, moduleSlug: event.target.value })}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
        >
          <option value="core">Core</option>
          {modules.map((module) => (
            <option key={module.slug} value={module.slug}>
              {module.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Metadata (JSON)</label>
        <textarea
          value={form.metadata}
          onChange={(event) => setForm({ ...form, metadata: event.target.value })}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
          rows={3}
          placeholder='{"detalle":"marcha"}'
        />
      </div>
      <button className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        Registrar evento
      </button>
      <p className="text-sm text-slate-500">{status}</p>
    </form>
  );
}
