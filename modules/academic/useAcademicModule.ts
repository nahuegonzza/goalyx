'use client';

import { useEffect, useMemo, useState } from 'react';
import { getLocalDateString } from '@lib/dateHelpers';
import { parseAcademicData, DEFAULT_ACADEMIC_DATA, getLatestAcademicSubjects, AcademicSubject, AcademicEvent } from './academicHelpers';
import type { ModuleEntry } from '@types';

interface UseAcademicModuleResult {
  loading: boolean;
  error: string | null;
  subjects: AcademicSubject[];
  todayEvents: AcademicEvent[];
  upcomingEvents: AcademicEvent[];
  allEvents: AcademicEvent[];
  isSaving: boolean;
  saveSubjects: (updatedSubjects: AcademicSubject[]) => Promise<void>;
  addEvent: (event: AcademicEvent) => Promise<void>;
  toggleEventCompleted: (event: AcademicEvent) => Promise<void>;
  deleteSubject: (subjectId: string) => Promise<void>;
}

export function useAcademicModule(
  moduleId: string,
  moduleSlug: string,
  selectedDate: string,
  config: Record<string, unknown>
): UseAcademicModuleResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allEntries, setAllEntries] = useState<ModuleEntry[]>([]);
  const [subjects, setSubjects] = useState<AcademicSubject[]>([]);
  const [todayEvents, setTodayEvents] = useState<AcademicEvent[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const todayKey = selectedDate.slice(0, 10);

  useEffect(() => {
    async function loadEntries() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/moduleEntries?module=${moduleSlug}`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('No se pudieron cargar los datos académicos');
        }

        const entries: ModuleEntry[] = await res.json();
        setAllEntries(entries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
        setLoading(false);
      }
    }

    if (moduleId) {
      loadEntries();
    }
  }, [moduleId, moduleSlug, selectedDate]);

  useEffect(() => {
    const currentEntry = allEntries.find((entry) => entry.date.slice(0, 10) === todayKey);
    const subjectSource = getLatestAcademicSubjects(allEntries, todayKey);
    setSubjects(subjectSource);
    if (currentEntry) {
      setTodayEvents(parseAcademicData(currentEntry.data).events);
    } else {
      setTodayEvents([]);
    }
  }, [allEntries, todayKey]);

  const allEvents = useMemo(() => {
    return allEntries.flatMap((entry) => parseAcademicData(entry.data).events);
  }, [allEntries]);

  const upcomingEvents = useMemo(() => {
    const today = new Date(todayKey);
    return allEvents
      .filter((event) => {
        const eventDate = new Date(event.date.slice(0, 10));
        return eventDate > today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents, todayKey]);

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/moduleEntries?module=${moduleSlug}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudieron recargar los datos académicos');
      const entries: ModuleEntry[] = await res.json();
      setAllEntries(entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async (date: string, entrySubjects: AcademicSubject[], entryEvents: AcademicEvent[]) => {
    setIsSaving(true);
    setError(null);

    try {
      const result = await fetch('/api/moduleEntries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          date,
          data: { subjects: entrySubjects, events: entryEvents }
        })
      });

      if (!result.ok) {
        const json = await result.json().catch(() => null);
        throw new Error(json?.error || 'Error guardando los datos académicos');
      }

      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsSaving(false);
    }
  };

  const saveSubjects = async (updatedSubjects: AcademicSubject[]) => {
    const currentEntry = allEntries.find((entry) => entry.date.slice(0, 10) === todayKey);
    const currentEvents = currentEntry ? parseAcademicData(currentEntry.data).events : [];
    setSubjects(updatedSubjects);
    await saveEntry(selectedDate, updatedSubjects, currentEvents);
  };

  const addEvent = async (event: AcademicEvent) => {
    const entryDate = event.date.slice(0, 10) || getLocalDateString();
    const targetEntry = allEntries.find((entry) => entry.date.slice(0, 10) === entryDate);
    const existingData = targetEntry ? parseAcademicData(targetEntry.data) : DEFAULT_ACADEMIC_DATA;
    const nextEvents = [...existingData.events, event];
    const subjectsToSave = existingData.subjects.length ? existingData.subjects : subjects;
    await saveEntry(entryDate, subjectsToSave, nextEvents);
  };

  const toggleEventCompleted = async (event: AcademicEvent) => {
    const entryDate = event.date.slice(0, 10);
    const targetEntry = allEntries.find((entry) => entry.date.slice(0, 10) === entryDate);
    const existingData = targetEntry ? parseAcademicData(targetEntry.data) : DEFAULT_ACADEMIC_DATA;
    const updatedEvents = existingData.events.map((currentEvent) =>
      currentEvent.id === event.id ? { ...currentEvent, completed: !currentEvent.completed } : currentEvent
    );
    await saveEntry(entryDate, existingData.subjects, updatedEvents);
  };

  const deleteSubject = async (subjectId: string) => {
    const currentEntry = allEntries.find((entry) => entry.date.slice(0, 10) === todayKey);
    const existingData = currentEntry ? parseAcademicData(currentEntry.data) : DEFAULT_ACADEMIC_DATA;
    const updatedSubjects = existingData.subjects.filter((subject) => subject.id !== subjectId);
    const updatedEvents = existingData.events.filter((event) => event.subjectId !== subjectId);
    setSubjects(updatedSubjects);
    await saveEntry(selectedDate, updatedSubjects, updatedEvents);
  };

  return {
    loading,
    error,
    subjects,
    todayEvents,
    upcomingEvents,
    allEvents,
    isSaving,
    saveSubjects,
    addEvent,
    toggleEventCompleted,
    deleteSubject
  };
}
