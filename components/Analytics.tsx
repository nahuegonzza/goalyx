'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Goal, GoalEntryWithGoal } from '@types';
import { parseLocalDate, formatLocalDate, getLocalDateString } from '@lib/dateHelpers';
import { doesGoalOverlapRange, isGoalActiveOnDate } from '@lib/goalHelpers';

function getLocalDateStringFromEntry(dateString: string) {
  if (!dateString.includes('T')) {
    return dateString;
  }
  // Extraer YYYY-MM-DD directamente de la cadena ISO para evitar problemas de zona horaria
  return dateString.split('T')[0];
}

function getEntryPoints(entry: GoalEntryWithGoal) {
  return entry.goal.type === 'BOOLEAN'
    ? entry.valueBoolean ? Number(entry.goal.pointsIfTrue ?? 1) : Number(entry.goal.pointsIfFalse ?? 0)
    : Number(entry.valueFloat ?? 0) * Number(entry.goal.pointsPerUnit ?? 1);
}


const RANGE_LABELS = {
  week: 'Semana actual',
  month: 'Mes actual',
  year: 'Año actual',
  custom: 'Personalizado'
} as const;

function getRangeDays(range: 'week' | 'month' | 'year' | 'custom', fromDate?: string, toDate?: string) {
  if (range === 'week') return 7;
  if (range === 'month') return 30;
  if (range === 'year') return 365;
  if (!fromDate || !toDate) return 0;
  const start = parseLocalDate(fromDate);
  const end = parseLocalDate(toDate);
  const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 0;
}

function getDatesInRange(from: string, to: string): string[] {
  const dates = [];
  const start = parseLocalDate(from);
  const end = parseLocalDate(to);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(formatLocalDate(new Date(d)));
  }
  return dates;
}

function getCurrentWeekRange() {
  const today = parseLocalDate(getLocalDateString());
  const day = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { fromDate: formatLocalDate(start), toDate: formatLocalDate(end) };
}

function getCurrentMonthRange() {
  const today = parseLocalDate(getLocalDateString());
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { fromDate: formatLocalDate(start), toDate: formatLocalDate(end) };
}

function getCurrentYearRange() {
  const today = parseLocalDate(getLocalDateString());
  const start = new Date(today.getFullYear(), 0, 1);
  const end = new Date(today.getFullYear(), 11, 31);
  return { fromDate: formatLocalDate(start), toDate: formatLocalDate(end) };
}

export default function Analytics() {
  const [entries, setEntries] = useState<GoalEntryWithGoal[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [moduleEntries, setModuleEntries] = useState<any[]>([]);
  const [activeModules, setActiveModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'week' | 'month' | 'year' | 'custom'>('month');
  const [selectedGoalId, setSelectedGoalId] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState(getLocalDateString());
  const [viewMode, setViewMode] = useState<'overview' | 'goal'>('overview');

  useEffect(() => {
    if (selectedRange === 'week') {
      const range = getCurrentWeekRange();
      setFromDate(range.fromDate);
      setToDate(range.toDate);
    } else if (selectedRange === 'month') {
      const range = getCurrentMonthRange();
      setFromDate(range.fromDate);
      setToDate(range.toDate);
    } else if (selectedRange === 'year') {
      const range = getCurrentYearRange();
      setFromDate(range.fromDate);
      setToDate(range.toDate);
    }
  }, [selectedRange]);

  useEffect(() => {
    loadGoals();
    loadEntries();
    loadModuleEntries();
    loadModules();
  }, []);

  async function loadEntries() {
    setLoading(true);
    try {
      // Load all entries for analytics (no date filter)
      const res = await fetch('/api/goalEntries?all=true');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadModuleEntries() {
    try {
      const res = await fetch('/api/moduleEntries');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setModuleEntries(data);
    } catch (error) {
      console.error('Error loading module entries:', error);
    }
  }

  async function loadModules() {
    try {
      const res = await fetch('/api/modules');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const modules = await res.json();
      const active = modules.filter((m: any) => m.active);
      const withDefinitions = active.map((mod: any) => {
        const definition = moduleDefinitions.find(d => d.slug === mod.slug);
        return {
          ...mod,
          config: mod.config || definition?.defaultConfig || {},
          definition,
        };
      });
      setActiveModules(withDefinitions);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  }

  async function loadGoals() {
    try {
      const res = await fetch('/api/goals');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  }

  const availableGoals = useMemo(
    () => goals.filter((goal) => doesGoalOverlapRange(goal, fromDate, toDate)),
    [goals, fromDate, toDate]
  );

  useEffect(() => {
    if (selectedGoalId !== 'all' && !availableGoals.some((goal) => goal.id === selectedGoalId)) {
      setSelectedGoalId('all');
    }
  }, [availableGoals, selectedGoalId]);

  const activeGoal = useMemo(() => goals.find((goal) => goal.id === selectedGoalId), [goals, selectedGoalId]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const entryDate = getLocalDateStringFromEntry(entry.date);
      const inRange = entryDate >= fromDate && entryDate <= toDate;
      const goalMatch = viewMode === 'goal' ? entry.goalId === selectedGoalId : true;
      return inRange && goalMatch && isGoalActiveOnDate(entry.goal, entryDate);
    });
  }, [entries, fromDate, toDate, selectedGoalId, viewMode]);

  const filteredModuleEntries = useMemo(() => {
    return moduleEntries.filter((entry) => {
      const entryDate = entry.date.slice(0, 10); // Extract YYYY-MM-DD from ISO string
      return entryDate >= fromDate && entryDate <= toDate;
    });
  }, [moduleEntries, fromDate, toDate]);

  const dailyScores = useMemo(() => {
    return allDates.map(date => {
      const dayEntries = filteredEntries.filter(entry => getLocalDateStringFromEntry(entry.date) === date);
      const goalPoints = dayEntries.reduce((sum, entry) => sum + getEntryPoints(entry), 0);
      
      // Calculate module points for this date
      let modulePoints = 0;
      for (const module of activeModules) {
        if (module.definition?.calculateScore) {
          const moduleDayEntries = filteredModuleEntries.filter((e) => 
            e.date.slice(0, 10) === date && e.moduleId === module.id
          );
          modulePoints += module.definition.calculateScore(moduleDayEntries, module.config);
        }
      }
      
      const totalPoints = goalPoints + modulePoints;
      const hasData = dayEntries.length > 0 || modulePoints !== 0;
      return { date, points: totalPoints, displayDate: date.split('-').reverse().join('/'), hasData };
    });
  }, [allDates, filteredEntries, filteredModuleEntries, activeModules]);

  const totalPoints = useMemo(() => dailyScores.reduce((sum, item) => sum + item.points, 0), [dailyScores]);
  const averagePoints = useMemo(() => (allDates.length ? totalPoints / allDates.length : 0), [dailyScores, totalPoints, allDates]);
  const maxPoints = useMemo(() => (dailyScores.filter(s => s.hasData).length ? Math.max(...dailyScores.filter(s => s.hasData).map((item) => item.points)) : 0), [dailyScores]);
  const minPoints = useMemo(() => (dailyScores.filter(s => s.hasData).length ? Math.min(...dailyScores.filter(s => s.hasData).map((item) => item.points)) : 0), [dailyScores]);

  const chartPoints = useMemo(() => {
    if (dailyScores.length === 0) return '';
    const start = parseLocalDate(fromDate);
    const end = parseLocalDate(toDate);
    const totalMs = end.getTime() - start.getTime();
    const range = maxPoints - minPoints || 1;
    return dailyScores
      .map((item) => {
        const dateMs = parseLocalDate(item.date).getTime();
        const x = totalMs === 0 ? 50 : ((dateMs - start.getTime()) / totalMs) * 100;
        const points = item.hasData ? item.points : 0;
        const y = 90 - ((points - minPoints) / range) * 80;
        return `${x},${y}`;
      })
      .join(' ');
  }, [dailyScores, maxPoints, minPoints, fromDate, toDate]);

  const previousPeriodPoints = useMemo(() => {
    const days = getRangeDays(selectedRange, fromDate, toDate);
    const start = parseLocalDate(fromDate);
    const end = new Date(start);
    end.setDate(end.getDate() - 1);
    const previousStart = new Date(end);
    previousStart.setDate(previousStart.getDate() - days + 1);
    const prevStartKey = formatLocalDate(previousStart);
    const prevEndKey = formatLocalDate(end);

    const previousEntries = entries.filter((entry) => {
      const entryDate = getLocalDateStringFromEntry(entry.date);
      const inRange = entryDate >= prevStartKey && entryDate <= prevEndKey;
      const goalMatch = viewMode === 'goal' ? entry.goalId === selectedGoalId : true;
      return inRange && goalMatch && isGoalActiveOnDate(entry.goal, entryDate);
    });

    const previousModuleEntries = moduleEntries.filter((entry) => {
      const entryDate = entry.date.slice(0, 10);
      return entryDate >= prevStartKey && entryDate <= prevEndKey;
    });

    let goalPoints = previousEntries.reduce((sum, entry) => {
      const points = getEntryPoints(entry);
      return sum + points;
    }, 0);

    let modulePoints = 0;
    for (const module of activeModules) {
      if (module.definition?.calculateScore) {
        const modulePrevEntries = previousModuleEntries.filter((e) => e.moduleId === module.id);
        modulePoints += module.definition.calculateScore(modulePrevEntries, module.config);
      }
    }

    return goalPoints + modulePoints;
  }, [entries, moduleEntries, fromDate, selectedGoalId, selectedRange, viewMode, activeModules]);

  const periodDiff = totalPoints - previousPeriodPoints;
  const periodDirection = periodDiff >= 0 ? 'Mejor' : 'Peor';
  const title = viewMode === 'overview' ? 'Resumen global' : 'Por objetivo: ' + (activeGoal?.title ?? 'Selecciona un objetivo');

  return <div>Analytics</div>;
}
