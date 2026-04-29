'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { AcademicEvent, AcademicSubject, AcademicExamType, AcademicTaskPriority } from './academicHelpers';

interface AcademicEventFormProps {
  subjects: AcademicSubject[];
  onAddEvent: (event: AcademicEvent) => Promise<void>;
  isSaving: boolean;
}

const examTypes: AcademicExamType[] = ['parcial', 'final', 'recuperatorio'];
const taskPriorities: AcademicTaskPriority[] = ['alta', 'media', 'baja'];

export function AcademicEventForm({ subjects, onAddEvent, isSaving }: AcademicEventFormProps) {
  const [eventType, setEventType] = useState<AcademicEvent['type']>('exam');
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [examType, setExamType] = useState<AcademicExamType>('parcial');
  const [priority, setPriority] = useState<AcademicTaskPriority>('media');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (subjects.length && !subjects.some((subject) => subject.id === subjectId)) {
      setSubjectId(subjects[0].id);
    }
  }, [subjects, subjectId]);

  const subjectOptions = useMemo(() => subjects.map((subject) => (
    <option key={subject.id} value={subject.id}>{subject.name || 'Asignar materia'}</option>
  )), [subjects]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !subjectId) return;

    const newEvent: AcademicEvent = {
      id: crypto.randomUUID(),
      subjectId,
      title: title.trim(),
      description: description.trim(),
      date,
      completed,
      type: eventType,
      examType: eventType === 'exam' ? examType : undefined,
      priority: eventType === 'task' ? priority : undefined
    };

    await onAddEvent(newEvent);
    setTitle('');
    setDescription('');
    setCompleted(false);
    setDate(new Date().toISOString().slice(0, 10));
  };

  if (subjects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Agrega primero una materia para poder crear parciales y tareas.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Tipo de evento</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as AcademicEvent['type'])}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
            >
              <option value="exam">Examen</option>
              <option value="task">Tarea</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Materia</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
            >
              {subjectOptions}
            </select>
          </div>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            {isSaving ? 'Guardando...' : 'Agregar evento'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={eventType === 'exam' ? 'Parcial de Estadística' : 'Tarea de Filosofía'}
            className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Descripción</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tema, consultorio, lugar..."
            className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {eventType === 'exam' ? (
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Tipo de examen</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value as AcademicExamType)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
            >
              {examTypes.map((typeOption) => (
                <option key={typeOption} value={typeOption}>{typeOption}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Prioridad</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as AcademicTaskPriority)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
            >
              {taskPriorities.map((priorityOption) => (
                <option key={priorityOption} value={priorityOption}>{priorityOption}</option>
              ))}
            </select>
          </div>
        )}

        <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          Marcar como completado
        </label>
      </div>
    </form>
  );
}
