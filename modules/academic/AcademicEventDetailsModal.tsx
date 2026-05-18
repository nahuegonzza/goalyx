'use client';

import { usePreventScroll } from '@hooks/usePreventScroll';
import ModalOverlay from '@components/ModalOverlay';
import type { AcademicEvent, AcademicSubject } from './academicHelpers';
import { getAcademicExamTypeLabelByType } from './academicHelpers';
import { getColorOption } from '@lib/goalIconsColors';

interface AcademicEventDetailsModalProps {
  open: boolean;
  event: AcademicEvent;
  subject?: AcademicSubject;
  onClose: () => void;
}

const normalizeHex = (hex: string) => {
  let cleaned = hex.trim().replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((char) => char + char).join('');
  }
  return /^[0-9A-Fa-f]{6}$/.test(cleaned) ? cleaned : null;
};

const parseRgbString = (rgb: string) => {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  };
};

const hexToRgba = (color: string, alpha: number) => {
  const normalized = normalizeHex(color);
  if (normalized) {
    const intValue = parseInt(normalized, 16);
    const r = (intValue >> 16) & 255;
    const g = (intValue >> 8) & 255;
    const b = intValue & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const rgb = parseRgbString(color);
  if (rgb) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }

  return undefined;
};

const getContrastTextColor = (color: string) => {
  const normalized = normalizeHex(color);
  let r: number | null = null;
  let g: number | null = null;
  let b: number | null = null;

  if (normalized) {
    const intValue = parseInt(normalized, 16);
    r = (intValue >> 16) & 255;
    g = (intValue >> 8) & 255;
    b = intValue & 255;
  } else {
    const rgb = parseRgbString(color);
    if (rgb) {
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;
    }
  }

  if (r === null || g === null || b === null) return '#111';
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#111' : '#fff';
};

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getEventTypeLabel = (event: AcademicEvent) => {
  if (event.type === 'exam') {
    return `Examen • ${getAcademicExamTypeLabelByType(event.examType)}`;
  }

  const priorityLabel = event.priority ? `Prioridad ${event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}` : 'Tarea';
  const durationLabel = event.estimatedDuration ? ` • ${event.estimatedDuration.charAt(0).toUpperCase() + event.estimatedDuration.slice(1)}` : '';
  return `${priorityLabel}${durationLabel}`;
};

export default function AcademicEventDetailsModal({ open, event, subject, onClose }: AcademicEventDetailsModalProps) {
  usePreventScroll(open);

  if (!open) return null;

  const resolvedSubjectColor = subject?.color ? getColorOption(subject.color).bgColor : undefined;
  const subjectBadgeStyle = resolvedSubjectColor ? {
    backgroundColor: hexToRgba(resolvedSubjectColor, 0.22),
    color: getContrastTextColor(resolvedSubjectColor),
  } : undefined;

  return (
    <ModalOverlay blur="md" opacity="50">
      <div className="w-full max-w-3xl rounded-[28px] bg-white dark:bg-slate-950 p-6 shadow-2xl shadow-slate-900/20 pointer-events-auto">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Información completa del evento</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white break-words">
                {event.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="self-start rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Materia</p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{subject?.name ?? 'Sin materia'}</p>
              {subject?.semester && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Semestre {subject.semester}</p>
              )}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Fecha</p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{formatDateLabel(event.date)}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{event.completed ? 'Completado' : 'Pendiente'}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Tipo</p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{event.type === 'exam' ? 'Examen' : 'Tarea'}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Categoría</p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{getEventTypeLabel(event)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Nota</p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{event.type === 'exam' ? (typeof event.grade === 'number' ? event.grade.toFixed(1) : 'No registrada') : '-'}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">Detalles</span>
              {subject && (
                <span style={subjectBadgeStyle} className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] inline-block">
                  {subject.name}
                </span>
              )}
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                {event.completed ? 'Completado' : 'Pendiente'}
              </span>
            </div>
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{event.description || 'No hay descripción disponible.'}</p>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
