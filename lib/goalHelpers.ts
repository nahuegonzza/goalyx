import type { Goal } from '@types';

export function isGoalActiveOnDate(goal: Goal, dateString: string): boolean {
  const isActive = goal.isActive !== false;
  if (!isActive) return false;

  const activatedDateStr = goal.activatedAt ? goal.activatedAt.slice(0, 10) : null;
  const deactivatedDateStr = goal.deactivatedAt ? goal.deactivatedAt.slice(0, 10) : null;

  if (!activatedDateStr) return true;
  if (dateString < activatedDateStr) return false;
  if (deactivatedDateStr && dateString >= deactivatedDateStr) return false;
  return true;
}

export function doesGoalOverlapRange(goal: Goal, fromDate: string, toDate: string): boolean {
  const activatedDateStr = goal.activatedAt ? goal.activatedAt.slice(0, 10) : '0000-01-01';
  const deactivatedDateStr = goal.deactivatedAt ? goal.deactivatedAt.slice(0, 10) : '9999-12-31';
  return activatedDateStr <= toDate && deactivatedDateStr > fromDate;
}
