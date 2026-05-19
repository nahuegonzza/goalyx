'use client';

import type {
  AcademicSubject,
  AcademicTypeConfig,
  GroupByOption,
  SortOption,
  EventTypeFilter,
  StatusFilter,
  PriorityFilter,
  DurationFilter,
} from './academicHelpers';

interface AcademicFilterControlsProps {
  search: string;
  groupBy: GroupByOption;
  sortBy: SortOption;
  eventTypeFilter: EventTypeFilter;
  statusFilter: StatusFilter;
  subjectFilter: string;
  priorityFilter: PriorityFilter;
  durationFilter: DurationFilter;
  dateFrom: string;
  dateTo: string;
  subjects: AcademicSubject[];
  availableTaskTypes: AcademicTypeConfig[];
  onChange: (field: string, value: string) => void;
}

export default function AcademicFilterControls({
  search,
  groupBy,
  sortBy,
  eventTypeFilter,
  statusFilter,
  subjectFilter,
  priorityFilter,
  durationFilter,
  dateFrom,
  dateTo,
  subjects,
  availableTaskTypes,
  onChange,
}: AcademicFilterControlsProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-2">Buscar</label>
        <input
          value={search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="Título, descripción o materia"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-1 min-w-0">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Agrupar</span>
          <select
            value={groupBy}
            onChange={(e) => onChange('groupBy', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
          >
            <option value="none">Sin orden</option>
            <option value="date">Agrupar por fecha</option>
            <option value="subject">Agrupar por materia</option>
          </select>
        </label>

        <label className="space-y-1 min-w-0">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Orden</span>
          <select
            value={sortBy}
            onChange={(e) => onChange('sortBy', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
          >
            <option value="default">Sin orden</option>
            <option value="dateAsc">Fecha ascendente</option>
            <option value="dateDesc">Fecha descendente</option>
            <option value="subject">Materia</option>
            <option value="priority">Prioridad / examen</option>
          </select>
        </label>

        <label className="space-y-1 min-w-0">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Tipo</span>
          <select
            value={eventTypeFilter}
            onChange={(e) => onChange('eventTypeFilter', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
          >
            <option value="all">Todos</option>
            <option value="exam">Exámenes</option>
            <option value="task">Tareas</option>
          </select>
        </label>

        <label className="space-y-1 min-w-0">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Prioridad</span>
          <select
            value={priorityFilter}
            onChange={(e) => onChange('priorityFilter', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
          >
            <option value="all">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1 min-w-0 lg:col-span-2">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Entre fechas</span>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onChange('dateFrom', e.target.value)}
              className="w-full min-w-[12rem] rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onChange('dateTo', e.target.value)}
              className="w-full min-w-[12rem] rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
            />
          </div>
        </label>

        <label className="space-y-1 min-w-0">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Estado</span>
          <select
            value={statusFilter}
            onChange={(e) => onChange('statusFilter', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completados</option>
          </select>
        </label>

        <label className="space-y-1 min-w-0">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Materia</span>
          <select
            value={subjectFilter}
            onChange={(e) => onChange('subjectFilter', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
          >
            <option value="all">Todas</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1 min-w-0">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Tipo de tarea</span>
          <select
            value={durationFilter}
            onChange={(e) => onChange('durationFilter', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
          >
            <option value="all">Todas</option>
            {availableTaskTypes && availableTaskTypes.length > 0 ? availableTaskTypes.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            )) : (
              <>
                <option value="corta">Corta</option>
                <option value="media">Media</option>
                <option value="extensa">Extensa</option>
                <option value="lectura">Lectura</option>
                <option value="escritura">Escritura</option>
                <option value="codigo">Código</option>
                <option value="practica">Práctica</option>
              </>
            )}
          </select>
        </label>
      </div>
    </div>
  );
}
