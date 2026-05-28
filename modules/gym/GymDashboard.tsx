'use client';

import { useEffect, useMemo, useState } from 'react';
import { getLocalDateString, formatDateDMY, formatDateLong, parseLocalDate, formatLocalDate } from '@lib/dateHelpers';
import type { ModuleState } from '@types';

const WEEK_DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MUSCLE_GROUPS = [
  'Pecho',
  'Espalda',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Piernas',
  'Cuádriceps',
  'Femorales',
  'Glúteos',
  'Gemelos',
  'Abdominales',
  'Core',
  'Trapecio',
  'Lumbar',
  'Full Body',
  'Cardio',
  'Movilidad'
];
const EXERCISE_TYPES = ['fuerza', 'hipertrofia', 'cardio', 'movilidad', 'calistenia'];
const MOODS = ['Excelente', 'Bien', 'Normal', 'Cansado', 'Muy cansado'];

interface GymExercise {
  id: string;
  name: string;
  muscleGroup: string;
  type: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  distance: number;
  rest: number;
  rpe: number;
  notes: string;
  completed: boolean;
  isPR: boolean;
}

interface GymEntryData {
  attended: boolean;
  startTime: string;
  endTime: string;
  notes: string;
  energy: number;
  mood: string;
  quality: number;
  fatigue: number;
  soreness: number;
  weight: number;
  water: number;
  cardioMinutes: number;
  exercises: GymExercise[];
  routineName: string;
}

const defaultGymEntryData: GymEntryData = {
  attended: false,
  startTime: '07:00',
  endTime: '08:00',
  notes: '',
  energy: 5,
  mood: 'Normal',
  quality: 5,
  fatigue: 3,
  soreness: 2,
  weight: 0,
  water: 2,
  cardioMinutes: 0,
  exercises: [],
  routineName: ''
};

const createExercise = (): GymExercise => ({
  id: crypto.randomUUID(),
  name: '',
  muscleGroup: 'Pecho',
  type: 'fuerza',
  sets: 3,
  reps: 8,
  weight: 0,
  duration: 0,
  distance: 0,
  rest: 90,
  rpe: 6,
  notes: '',
  completed: false,
  isPR: false
});

function calculateDurationMinutes(startTime: string, endTime: string) {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  if (Number.isNaN(startHours) || Number.isNaN(startMinutes) || Number.isNaN(endHours) || Number.isNaN(endMinutes)) {
    return 0;
  }
  const start = new Date();
  start.setHours(startHours, startMinutes, 0, 0);
  const end = new Date();
  end.setHours(endHours, endMinutes, 0, 0);
  const diff = end.getTime() - start.getTime();
  return diff >= 0 ? Math.round(diff / 60000) : 0;
}

function parseGymData(raw: unknown): GymEntryData {
  if (!raw || typeof raw !== 'object') return defaultGymEntryData;
  try {
    const parsed = raw as Partial<GymEntryData>;
    return {
      ...defaultGymEntryData,
      ...parsed,
      exercises: Array.isArray(parsed.exercises)
        ? parsed.exercises.map((exercise) => ({
            ...createExercise(),
            ...(typeof exercise === 'object' && exercise ? exercise : {})
          }))
        : []
    };
  } catch {
    return defaultGymEntryData;
  }
}

interface GymDashboardProps {
  module?: ModuleState | null;
  config?: Record<string, unknown>;
  onUpdate?: () => void;
  isEditing?: boolean;
  date?: string;
}

export default function GymDashboard({ module, config, onUpdate, isEditing = true, date }: GymDashboardProps) {
  const selectedDate = date || getLocalDateString();
  const [gymModule, setGymModule] = useState<ModuleState | null>(module ?? null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [entryData, setEntryData] = useState<GymEntryData>(defaultGymEntryData);
  const [history, setHistory] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const trainingDays = useMemo(() => (config?.trainingDays as number[]) ?? [1, 3, 5], [config?.trainingDays]);
  const weeklyTarget = Number(config?.weeklyTarget ?? 3);
  const weightGoal = Number(config?.weightGoal ?? 75);

  useEffect(() => {
    if (module) {
      setGymModule(module);
    }
  }, [module]);

  useEffect(() => {
    async function loadModule() {
      if (gymModule?.id) return;
      try {
        const res = await fetch('/api/modules', { credentials: 'include' });
        if (!res.ok) throw new Error('No se pudo cargar el módulo');
        const modules = await res.json();
        const gym = modules.find((item: any) => item.slug === 'gym');
        if (gym) {
          setGymModule(gym as ModuleState);
        } else {
          setError('El módulo Gimnasio no está disponible. Actívalo en Ajustes > Módulos.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el módulo');
      }
    }
    loadModule();
  }, [gymModule]);

  useEffect(() => {
    async function loadEntries() {
      if (!gymModule?.id) return;
      setLoading(true);
      try {
        const res = await fetch('/api/moduleEntries?module=gym', { credentials: 'include' });
        if (!res.ok) throw new Error('Error al cargar historial de gimnasio');
        const entries = await res.json();
        setHistory(entries);
        const todayEntry = entries.find((item: any) => item.date.slice(0, 10) === selectedDate);
        if (todayEntry) {
          const data = parseGymData(typeof todayEntry.data === 'string' ? JSON.parse(todayEntry.data) : todayEntry.data);
          setEntryData(data);
        } else {
          setEntryData(defaultGymEntryData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    }
    loadEntries();
  }, [gymModule?.id, selectedDate, refreshKey]);

  useEffect(() => {
    if (message) {
      const timer = window.setTimeout(() => setMessage(''), 3000);
      return () => window.clearTimeout(timer);
    }
  }, [message]);

  const exerciseVolume = useMemo(() => {
    return entryData.exercises.reduce((sum, exercise) => {
      return sum + exercise.sets * exercise.reps * exercise.weight;
    }, 0);
  }, [entryData.exercises]);

  const historyVolume = useMemo(() => {
    return history.reduce((sum, item) => {
      try {
        const parsed = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
        const exercises = Array.isArray(parsed?.exercises) ? parsed.exercises : [];
        return (
          sum +
          exercises.reduce((subSum: number, exercise: any) => {
            return subSum + (Number(exercise.sets) || 0) * (Number(exercise.reps) || 0) * (Number(exercise.weight) || 0);
          }, 0)
        );
      } catch {
        return sum;
      }
    }, 0);
  }, [history]);

  const attendanceDays = useMemo(() => {
    const attended = new Set(
      history
        .filter((item) => {
          try {
            const parsed = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
            return Boolean(parsed?.attended);
          } catch {
            return false;
          }
        })
        .map((item) => item.date.slice(0, 10))
    );
    return attended;
  }, [history]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    let date = parseLocalDate(selectedDate);
    while (attendanceDays.has(formatLocalDate(date))) {
      streak += 1;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  }, [attendanceDays, selectedDate]);

  const sessionsThisMonth = useMemo(() => {
    const month = selectedDate.slice(0, 7);
    return history.filter((item) => item.date.slice(0, 7) === month).length;
  }, [history, selectedDate]);

  const expectedTrainingDaysThisMonth = useMemo(() => {
    const [year, month] = selectedDate.split('-').map(Number);
    const totalDays = new Date(year, month, 0).getDate();
    let expected = 0;
    for (let day = 1; day <= totalDays; day += 1) {
      const weekday = new Date(year, month - 1, day).getDay();
      if (trainingDays.includes(weekday)) expected += 1;
    }
    return expected;
  }, [selectedDate, trainingDays]);

  const monthAttendancePercent = useMemo(() => {
    const completed = history.filter((item) => item.date.slice(0, 7) === selectedDate.slice(0, 7) && (() => {
      try {
        const parsed = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
        return Boolean(parsed?.attended);
      } catch {
        return false;
      }
    })()).length;
    return expectedTrainingDaysThisMonth > 0
      ? Math.round((completed / expectedTrainingDaysThisMonth) * 100)
      : 0;
  }, [history, selectedDate, expectedTrainingDaysThisMonth]);

  const handleFieldChange = (field: keyof GymEntryData, value: string | number | boolean) => {
    setEntryData((current) => ({
      ...current,
      [field]: value
    }));
    setDirty(true);
  };

  const handleExerciseChange = (id: string, field: keyof GymExercise, value: string | number | boolean) => {
    setEntryData((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === id ? { ...exercise, [field]: value } : exercise
      )
    }));
    setDirty(true);
  };

  const addExercise = () => {
    setEntryData((current) => ({
      ...current,
      exercises: [...current.exercises, createExercise()]
    }));
    setDirty(true);
  };

  const removeExercise = (id: string) => {
    setEntryData((current) => ({
      ...current,
      exercises: current.exercises.filter((exercise) => exercise.id !== id)
    }));
    setDirty(true);
  };

  const saveEntry = async () => {
    if (!gymModule?.id) {
      setError('No se encontró el módulo Gimnasio');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        moduleId: gymModule.id,
        date: selectedDate,
        data: {
          ...entryData,
          totalVolume: exerciseVolume,
          attended: Boolean(entryData.attended)
        }
      };

      const res = await fetch('/api/moduleEntries', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const responseData = await res.json().catch(() => null);
        throw new Error(responseData?.error || 'Error al guardar el registro');
      }

      setMessage('Entrenamiento guardado correctamente');
      setDirty(false);
      setRefreshKey((current) => current + 1);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const percentToNextGoal = Math.max(0, Math.min(100, Math.round((sessionsThisMonth / weeklyTarget) * 100)));

  if (loading && !gymModule) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-3/5 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600 dark:text-rose-400">Gimnasio</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Seguimiento de entrenamiento</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Registra tu asistencia diaria, serie por serie y compara tu progreso con la configuración de rutina.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Sesiones este mes</p>
              <p className="mt-3 text-3xl font-semibold">{sessionsThisMonth}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Racha actual</p>
              <p className="mt-3 text-3xl font-semibold">{currentStreak} día{currentStreak === 1 ? '' : 's'}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Asistencia</p>
              <p className="mt-3 text-3xl font-semibold">{monthAttendancePercent}%</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Volumen total</p>
              <p className="mt-3 text-3xl font-semibold">{historyVolume.toLocaleString()} kg</p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          {message}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Entrenamiento de hoy</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatDateLong(selectedDate)}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{formatDateDMY(selectedDate)}</p>
            </div>
            <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              Días previstos: {expectedTrainingDaysThisMonth} | Objetivo semanal: {weeklyTarget}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                handleFieldChange('attended', true);
                setDirty(true);
              }}
              className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${entryData.attended ? 'border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-500 dark:bg-rose-950/50 dark:text-rose-300' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600'}`}
            >
              Fui al gimnasio
            </button>
            <button
              type="button"
              onClick={() => {
                handleFieldChange('attended', false);
                setDirty(true);
              }}
              className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${!entryData.attended ? 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600'}`}
            >
              No fui al gimnasio
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Entrada</label>
              <input
                type="time"
                value={entryData.startTime}
                onChange={(e) => handleFieldChange('startTime', e.target.value)}
                disabled={!entryData.attended || !isEditing}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-rose-400 dark:focus:ring-rose-950/20"
              />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Salida</label>
              <input
                type="time"
                value={entryData.endTime}
                onChange={(e) => handleFieldChange('endTime', e.target.value)}
                disabled={!entryData.attended || !isEditing}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-rose-400 dark:focus:ring-rose-950/20"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Duración</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{calculateDurationMinutes(entryData.startTime, entryData.endTime)} min</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Volumen de hoy</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{exerciseVolume.toLocaleString()} kg</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Nivel de energía</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{entryData.energy}/10</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Calidad del entrenamiento</label>
              <input
                type="range"
                min={1}
                max={10}
                value={entryData.quality}
                disabled={!entryData.attended || !isEditing}
                onChange={(e) => handleFieldChange('quality', Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-slate-500 dark:text-slate-400">{entryData.quality} / 10</p>
            </div>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Fatiga / dolor</label>
              <div className="grid gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Fatiga</p>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={entryData.fatigue}
                    disabled={!entryData.attended || !isEditing}
                    onChange={(e) => handleFieldChange('fatigue', Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400">{entryData.fatigue} / 10</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Dolor muscular</p>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={entryData.soreness}
                    disabled={!entryData.attended || !isEditing}
                    onChange={(e) => handleFieldChange('soreness', Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400">{entryData.soreness} / 10</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Peso corporal</label>
              <input
                type="number"
                min={0}
                value={entryData.weight || ''}
                disabled={!entryData.attended || !isEditing}
                onChange={(e) => handleFieldChange('weight', Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-rose-400 dark:focus:ring-rose-950/20"
              />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Agua (L)</label>
              <input
                type="number"
                min={0}
                value={entryData.water || ''}
                disabled={!entryData.attended || !isEditing}
                onChange={(e) => handleFieldChange('water', Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-rose-400 dark:focus:ring-rose-950/20"
              />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Cardio (min)</label>
              <input
                type="number"
                min={0}
                value={entryData.cardioMinutes || ''}
                disabled={!entryData.attended || !isEditing}
                onChange={(e) => handleFieldChange('cardioMinutes', Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-rose-400 dark:focus:ring-rose-950/20"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Notas del entrenamiento</label>
            <textarea
              rows={4}
              value={entryData.notes}
              disabled={!entryData.attended || !isEditing}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-rose-400 dark:focus:ring-rose-950/20"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ejercicios del día</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Agrega un entrenamiento que puedas completar paso a paso.</p>
              </div>
              <button
                type="button"
                onClick={addExercise}
                disabled={!entryData.attended || !isEditing}
                className="rounded-3xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Añadir ejercicio
              </button>
            </div>

            <div className="space-y-4">
              {entryData.exercises.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  Agrega tu primer ejercicio para tener un registro completo.
                </div>
              )}
              {entryData.exercises.map((exercise) => (
                <div key={exercise.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">{exercise.type}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">{exercise.muscleGroup}</span>
                      </div>
                      <input
                        type="text"
                        value={exercise.name}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                        placeholder="Nombre del ejercicio"
                        className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-rose-400 dark:focus:ring-rose-950/20"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExercise(exercise.id)}
                      disabled={!isEditing}
                      className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-rose-500 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-400 dark:hover:text-rose-300"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Series</label>
                      <input
                        type="number"
                        min={1}
                        value={exercise.sets}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'sets', Number(e.target.value))}
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Reps</label>
                      <input
                        type="number"
                        min={0}
                        value={exercise.reps}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'reps', Number(e.target.value))}
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Peso (kg)</label>
                      <input
                        type="number"
                        min={0}
                        value={exercise.weight}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'weight', Number(e.target.value))}
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Descanso (s)</label>
                      <input
                        type="number"
                        min={0}
                        value={exercise.rest}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'rest', Number(e.target.value))}
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Tipo</label>
                      <select
                        value={exercise.type}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'type', e.target.value)}
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      >
                        {EXERCISE_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Grupo muscular</label>
                      <select
                        value={exercise.muscleGroup}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'muscleGroup', e.target.value)}
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      >
                        {MUSCLE_GROUPS.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Duración (min)</label>
                      <input
                        type="number"
                        min={0}
                        value={exercise.duration}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'duration', Number(e.target.value))}
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Distancia (m)</label>
                      <input
                        type="number"
                        min={0}
                        value={exercise.distance}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'distance', Number(e.target.value))}
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">RPE</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={exercise.rpe}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'rpe', Number(e.target.value))}
                        className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Notas</label>
                    <input
                      type="text"
                      value={exercise.notes}
                      disabled={!entryData.attended || !isEditing}
                      onChange={(e) => handleExerciseChange(exercise.id, 'notes', e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={exercise.completed}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'completed', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      />
                      Completado
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={exercise.isPR}
                        disabled={!entryData.attended || !isEditing}
                        onChange={(e) => handleExerciseChange(exercise.id, 'isPR', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      />
                      PR
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Próximo objetivo</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{percentToNextGoal}% hacia la meta semanal</p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-2 dark:bg-slate-900">
              <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-rose-600 transition-all" style={{ width: `${percentToNextGoal}%` }} />
              </div>
            </div>
            <button
              type="button"
              onClick={saveEntry}
              disabled={saving || !isEditing}
              className="inline-flex items-center justify-center rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {saving ? 'Guardando...' : 'Guardar entrenamiento'}
            </button>
          </div>
        </div>

        <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Resumen rápido</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Tu módulo se encarga de guardar asistencia, series y la evolución de tu volumen total.</p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Sesiones esperadas</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{expectedTrainingDaysThisMonth}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Días de entrenamiento</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{trainingDays.map((day) => WEEK_DAY_LABELS[day]).join(', ')}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Peso objetivo</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{weightGoal || '-'} kg</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Últimos entrenamientos</p>
            <div className="mt-4 space-y-3">
              {history.slice(0, 4).map((item) => {
                const data = parseGymData(typeof item.data === 'string' ? JSON.parse(item.data) : item.data);
                const historyEntryVolume = data.exercises.reduce((sum, exercise) => {
                  return sum + exercise.sets * exercise.reps * exercise.weight;
                }, 0);
                return (
                  <div key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatDateDMY(item.date.slice(0, 10))}</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{data.attended ? 'Fui' : 'No fui'}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Volumen {historyEntryVolume.toLocaleString()} kg</p>
                  </div>
                );
              })}
              {history.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">Aún no hay registros. Empieza con tu primer entrenamiento.</p>}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
