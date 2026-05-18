'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getColorOption } from '@lib/goalIconsColors';
import { AcademicEvent } from './academicHelpers';
import AcademicEventDetailsModal from './AcademicEventDetailsModal';

export type EventDisplayStyle = 'detailed' | 'compact' | 'list';

interface AcademicEventCardProps {
  event: AcademicEvent & { sourceDate: string; subject?: any };
  style: EventDisplayStyle;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onGradeChange?: (grade: number | undefined) => void;
}

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const formatEventTitle = (title: string) => {
  return title.length > 28 ? `${title.slice(0, 28).trimEnd()}…` : title;
};

const getExamLabel = (event: AcademicEvent) => {
  if (event.type !== 'exam') {
    const priority = event.priority ?? 'media';
    const priorityCap = priority.charAt(0).toUpperCase() + priority.slice(1);
    const duration = event.estimatedDuration ? ` • ${getDurationLabel(event.estimatedDuration)}` : '';
    return `Tarea - Prioridad ${priorityCap}${duration}`;
  }

  switch (event.examType) {
    case 'final':
      return 'Final';
    case 'recuperatorio':
      return 'Recuperatorio';
    case 'exposicion':
      return 'Exposición';
    case 'regular':
      return 'Regular';
    case 'oral':
      return 'Oral';
    case 'parcial':
    default:
      return 'Parcial';
  }
};

const getExamBadgeStyle = (event: AcademicEvent) => {
  if (event.type !== 'exam') return getTaskBadgeStyle(event.priority);
  switch (event.examType) {
    case 'final':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
    case 'recuperatorio':
      return 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300';
    case 'exposicion':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300';
    case 'regular':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300';
    case 'oral':
      return 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-300';
    case 'parcial':
    default:
      return 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300';
  }
};

const getTaskBadgeStyle = (priority?: string) => {
  switch (priority) {
    case 'alta':
      return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300';
    case 'media':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300';
    case 'baja':
    default:
      return 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300';
  }
};

const getDurationLabel = (duration: string) => {
  switch (duration) {
    case 'corta':
      return 'Corta';
    case 'media':
      return 'Media';
    case 'extensa':
      return 'Extensa';
    case 'lectura':
      return 'Lectura';
    case 'escritura':
      return 'Escritura';
    case 'codigo':
      return 'Código';
    case 'practica':
      return 'Práctica';
    default:
      return duration;
  }
};

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
  const normalizedHex = normalizeHex(color);
  if (normalizedHex) {
    const intValue = parseInt(normalizedHex, 16);
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

// Detailed Style - Original large card
const DetailedCard = ({ event, onToggleComplete, onEdit, onDelete, onGradeChange }: AcademicEventCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const subject = event.subject;
  const resolvedSubjectColor = subject?.color ? getColorOption(subject.color).bgColor : undefined;
  const cardBorderStyle = resolvedSubjectColor ? { borderColor: resolvedSubjectColor } : undefined;
  const subjectBadgeStyles = resolvedSubjectColor ? {
    backgroundColor: hexToRgba(resolvedSubjectColor, 0.22) ?? 'rgba(148, 163, 184, 0.16)',
    color: getContrastTextColor(resolvedSubjectColor),
  } : undefined;

  return (
    <>
      <article
        style={cardBorderStyle}
        onClick={() => setShowDetails(true)}
        className="min-w-0 rounded-3xl border border-slate-200 bg-white dark:bg-[#0f172a] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl text-slate-900 dark:text-white cursor-pointer"
      >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className={`rounded-full px-2 py-1 font-semibold uppercase tracking-[0.18em] ${getExamBadgeStyle(event)}`}>
              {getExamLabel(event)}
            </span>
            <span className="text-slate-400 dark:text-slate-300">{formatDateLabel(event.sourceDate)}</span>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${event.completed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'}`}>
              {event.completed ? 'Completado' : 'Pendiente'}
            </span>
          </div>
          <h2 className="mt-4 text-xl font-semibold leading-snug text-slate-900 dark:text-white max-w-full truncate whitespace-nowrap overflow-hidden">{formatEventTitle(event.title)}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 break-all">{event.description || 'Sin descripción'}</p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <span style={subjectBadgeStyles} className="rounded-full px-3 py-1 text-sm font-semibold max-w-[11rem] truncate whitespace-nowrap overflow-hidden block">
            {event.subject?.name || 'Sin materia'}
          </span>
          <div className="flex gap-2">
            {event.type === 'exam' ? (
              <input
                type="number"
                placeholder="Nota"
                step="0.1"
                min={0}
                max={10}
                defaultValue={event.grade !== undefined ? String(event.grade) : ''}
                onClick={(e) => e.stopPropagation()}
                onBlur={async (e) => {
                  const raw = String((e.target as HTMLInputElement).value).trim().replace(',', '.');
                  if (raw === '') {
                    onGradeChange?.(undefined);
                    return;
                  }
                  const parsed = Number(raw);
                  if (!Number.isNaN(parsed)) {
                    const clamped = Math.min(10, Math.max(0, parsed));
                    onGradeChange?.(clamped);
                  }
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const raw = String((e.target as HTMLInputElement).value).trim().replace(',', '.');
                    if (raw === '') {
                      onGradeChange?.(undefined);
                      (e.target as HTMLInputElement).blur();
                      return;
                    }
                    const parsed = Number(raw);
                    if (!Number.isNaN(parsed)) {
                      const clamped = Math.min(10, Math.max(0, parsed));
                      onGradeChange?.(clamped);
                    }
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="w-20 px-2 py-1 text-center text-sm rounded border border-slate-300 bg-white text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-600"
              />
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete?.();
                }}
                className="rounded-lg bg-emerald-100 p-2 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
                aria-label={event.completed ? 'Deshacer' : 'Marcar como listo'}
              >
                <Image
                  src={event.completed ? '/icons/ui/cancel_icon.png' : '/icons/ui/check_icon.png'}
                  alt={event.completed ? 'Deshacer' : 'Listo'}
                  width={18}
                  height={18}
                />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              aria-label="Editar"
            >
              <Image src="/icons/ui/edit_icon.png" alt="Editar" width={18} height={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              aria-label="Eliminar"
            >
              <Image src="/icons/ui/delete_icon.png" alt="Eliminar" width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
      {showDetails && (
        <AcademicEventDetailsModal
          open={showDetails}
          event={event}
          subject={subject}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

// Compact Style - 2 per row, no description, smaller text
const CompactCard = ({ event, onToggleComplete, onEdit, onDelete, onGradeChange }: AcademicEventCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const subject = event.subject;
  const resolvedSubjectColor = subject?.color ? getColorOption(subject.color).bgColor : undefined;
  const cardBorderStyle = resolvedSubjectColor ? { borderColor: resolvedSubjectColor } : undefined;
  const subjectBadgeStyles = resolvedSubjectColor ? {
    backgroundColor: hexToRgba(resolvedSubjectColor, 0.22) ?? 'rgba(148, 163, 184, 0.16)',
    color: getContrastTextColor(resolvedSubjectColor),
  } : undefined;

  return (
    <>
      <article
        style={cardBorderStyle}
        onClick={() => setShowDetails(true)}
        className="min-w-0 rounded-2xl border border-slate-200 bg-white dark:bg-[#0f172a] p-4 shadow-sm transition hover:shadow-lg text-slate-900 dark:text-white cursor-pointer"
      >
      <div className="flex flex-col gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-[0.15em] ${getExamBadgeStyle(event)}`}>
              {getExamLabel(event)}
            </span>
            <span className="text-slate-500 dark:text-slate-400">{formatDateLabel(event.sourceDate)}</span>
          </div>
          <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-900 dark:text-white truncate">{event.title}</h3>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span style={subjectBadgeStyles} className="rounded-full px-2 py-0.5 text-xs font-semibold max-w-[60%] truncate">
            {event.subject?.name || 'Sin materia'}
          </span>
          <div className="flex gap-1">
            {event.type === 'exam' ? (
              <input
                type="number"
                step="0.1"
                min={0}
                max={10}
                defaultValue={event.grade !== undefined ? String(event.grade) : ''}
                onClick={(e) => e.stopPropagation()}
                onBlur={async (e) => {
                  const raw = String((e.target as HTMLInputElement).value).trim().replace(',', '.');
                  if (raw === '') {
                    onGradeChange?.(undefined);
                    return;
                  }
                  const parsed = Number(raw);
                  if (!Number.isNaN(parsed)) {
                    const clamped = Math.min(10, Math.max(0, parsed));
                    onGradeChange?.(clamped);
                  }
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const raw = String((e.target as HTMLInputElement).value).trim().replace(',', '.');
                    if (raw === '') {
                      onGradeChange?.(undefined);
                      (e.target as HTMLInputElement).blur();
                      return;
                    }
                    const parsed = Number(raw);
                    if (!Number.isNaN(parsed)) {
                      const clamped = Math.min(10, Math.max(0, parsed));
                      onGradeChange?.(clamped);
                    }
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="w-16 px-1 py-0.5 text-center text-xs rounded border border-slate-300 bg-white text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-600"
              />
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete?.();
                }}
                className="rounded p-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
                aria-label={event.completed ? 'Deshacer' : 'Marcar como listo'}
              >
                <Image
                  src={event.completed ? '/icons/ui/cancel_icon.png' : '/icons/ui/check_icon.png'}
                  alt={event.completed ? 'Deshacer' : 'Listo'}
                  width={14}
                  height={14}
                />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="rounded p-1 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              aria-label="Editar"
            >
              <Image src="/icons/ui/edit_icon.png" alt="Editar" width={14} height={14} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="rounded p-1 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              aria-label="Eliminar"
            >
              <Image src="/icons/ui/delete_icon.png" alt="Eliminar" width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
      {showDetails && (
        <AcademicEventDetailsModal
          open={showDetails}
          event={event}
          subject={subject}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

// List Style - Very compact, minimal info
const ListCard = ({ event, onToggleComplete, onEdit, onDelete, onGradeChange }: AcademicEventCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const subject = event.subject;
  const resolvedSubjectColor = subject?.color ? getColorOption(subject.color).bgColor : undefined;
  const cardBorderStyle = resolvedSubjectColor ? { borderColor: resolvedSubjectColor } : undefined;
  const subjectBadgeStyles = resolvedSubjectColor ? {
    backgroundColor: hexToRgba(resolvedSubjectColor, 0.22) ?? 'rgba(148, 163, 184, 0.16)',
    color: getContrastTextColor(resolvedSubjectColor),
  } : undefined;

  return (
    <>
      <article
        style={cardBorderStyle}
        onClick={() => setShowDetails(true)}
        className="min-w-0 rounded-lg border border-slate-200 bg-white dark:bg-[#0f172a] px-3 py-2 shadow-sm text-slate-900 dark:text-white cursor-pointer"
      >
      <div className="flex items-center gap-2 justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-xs">
            <span className={`rounded-full px-1.5 py-0.5 font-semibold uppercase tracking-[0.1em] ${getExamBadgeStyle(event)}`}>
              {event.type === 'exam' ? event.examType?.charAt(0).toUpperCase() : 'T'}
            </span>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[500px]">{event.title}</h3>
            <span className="text-slate-500 dark:text-slate-500 text-xs flex-shrink-0">{formatDateLabel(event.sourceDate).split(',')[0]}</span>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {event.type === 'exam' ? (
            <input
              type="number"
              step="0.1"
              min={0}
              max={10}
              defaultValue={event.grade !== undefined ? String(event.grade) : ''}
              onClick={(e) => e.stopPropagation()}
              onBlur={async (e) => {
                const raw = String((e.target as HTMLInputElement).value).trim().replace(',', '.');
                if (raw === '') {
                  onGradeChange?.(undefined);
                  return;
                }
                const parsed = Number(raw);
                if (!Number.isNaN(parsed)) {
                  const clamped = Math.min(10, Math.max(0, parsed));
                  onGradeChange?.(clamped);
                }
              }}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  const raw = String((e.target as HTMLInputElement).value).trim().replace(',', '.');
                  if (raw === '') {
                    onGradeChange?.(undefined);
                    (e.target as HTMLInputElement).blur();
                    return;
                  }
                  const parsed = Number(raw);
                  if (!Number.isNaN(parsed)) {
                    const clamped = Math.min(10, Math.max(0, parsed));
                    onGradeChange?.(clamped);
                  }
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="w-12 px-1 py-0 text-center text-xs rounded border border-slate-300 bg-white text-slate-900 dark:bg-slate-800 dark:text-white dark:border-slate-600"
            />
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete?.();
              }}
              className="rounded p-0.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
              aria-label={event.completed ? 'Deshacer' : 'Marcar como listo'}
            >
              <Image
                src={event.completed ? '/icons/ui/cancel_icon.png' : '/icons/ui/check_icon.png'}
                alt={event.completed ? 'Deshacer' : 'Listo'}
                width={12}
                height={12}
              />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="rounded p-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label="Editar"
          >
            <Image src="/icons/ui/edit_icon.png" alt="Editar" width={12} height={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="rounded p-0.5 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label="Eliminar"
          >
            <Image src="/icons/ui/delete_icon.png" alt="Eliminar" width={12} height={12} />
          </button>
        </div>
      </div>
    </article>
      {showDetails && (
        <AcademicEventDetailsModal
          open={showDetails}
          event={event}
          subject={subject}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default function AcademicEventCard(props: AcademicEventCardProps) {
  switch (props.style) {
    case 'compact':
      return <CompactCard {...props} />;
    case 'list':
      return <ListCard {...props} />;
    case 'detailed':
    default:
      return <DetailedCard {...props} />;
  }
}
