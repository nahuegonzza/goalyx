'use client';

import { useEffect, useState } from 'react';
import type { AcademicSubject } from './academicHelpers';

interface AcademicConfigProps {
  subjects: AcademicSubject[];
  onSaveSubjects: (subjects: AcademicSubject[]) => Promise<void>;
  onDeleteSubject: (subjectId: string) => Promise<void>;
}

export function AcademicConfig({ subjects, onSaveSubjects, onDeleteSubject }: AcademicConfigProps) {
  const [editableSubjects, setEditableSubjects] = useState<AcademicSubject[]>(subjects);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditableSubjects(subjects);
  }, [subjects]);

  const handleFieldChange = (id: string, field: keyof AcademicSubject, value: string) => {
    setEditableSubjects((current) =>
      current.map((subject) => (subject.id === id ? { ...subject, [field]: value } : subject))
    );
  };

  const handleAddSubject = () => {
    const nextSubject: AcademicSubject = {
      id: crypto.randomUUID(),
      name: '',
      color: '#2563eb',
      semester: '1'
    };
    setEditableSubjects((current) => [...current, nextSubject]);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSaveSubjects(editableSubjects);
    setSaving(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Materias y colores</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configura tus materias y asigna los colores que se usarán en las tarjetas.</p>
        </div>
        <button
          type="button"
          onClick={handleAddSubject}
          className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
        >
          + Nueva materia
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {editableSubjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Sin materias aún. Agrega una materia para empezar a planificar tus parciales y entregas.
          </div>
        ) : (
          editableSubjects.map((subject) => (
            <div key={subject.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1.1fr_0.8fr_0.8fr_0.4fr] dark:border-slate-700 dark:bg-slate-900">
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Nombre</label>
                <input
                  value={subject.name}
                  onChange={(e) => handleFieldChange(subject.id, 'name', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
                  placeholder="Nombre de la materia"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Cuatrimestre</label>
                <input
                  value={subject.semester}
                  onChange={(e) => handleFieldChange(subject.id, 'semester', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
                  placeholder="Ej. 1º"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Color</label>
                <input
                  type="color"
                  value={subject.color}
                  onChange={(e) => handleFieldChange(subject.id, 'color', e.target.value)}
                  className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-slate-300 bg-white p-1 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <button
                type="button"
                onClick={() => onDeleteSubject(subject.id)}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-700/40 dark:bg-rose-950/50 dark:text-rose-300"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {saving ? 'Guardando...' : 'Guardar materias'}
        </button>
      </div>
    </div>
  );
}
