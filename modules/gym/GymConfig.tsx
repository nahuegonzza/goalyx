'use client';

import { useMemo, useState } from 'react';
import type { ModuleState } from '@types';

const WEEK_DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface GymConfigProps {
  module: ModuleState;
  onConfigChange: (config: Record<string, unknown>) => void;
}

export default function GymConfig({ module, onConfigChange }: GymConfigProps) {
  const initialConfig = useMemo(() => module.config || {}, [module.config]);
  const [weeklyTarget, setWeeklyTarget] = useState(Number(initialConfig.weeklyTarget ?? 3));
  const [trainingDays, setTrainingDays] = useState<number[]>(Array.isArray(initialConfig.trainingDays) ? (initialConfig.trainingDays as number[]) : [1, 3, 5]);
  const [weightGoal, setWeightGoal] = useState(Number(initialConfig.weightGoal ?? 75));
  const [volumeGoal, setVolumeGoal] = useState(Number(initialConfig.volumeGoal ?? 8000));

  const toggleDay = (day: number) => {
    const newDays = trainingDays.includes(day) ? trainingDays.filter((item) => item !== day) : [...trainingDays, day].sort((a, b) => a - b);
    setTrainingDays(newDays);
    onConfigChange({
      ...initialConfig,
      weeklyTarget,
      trainingDays: newDays,
      weightGoal,
      volumeGoal
    });
  };

  const handleWeeklyTargetChange = (value: number) => {
    setWeeklyTarget(value);
    onConfigChange({
      ...initialConfig,
      weeklyTarget: value,
      trainingDays,
      weightGoal,
      volumeGoal
    });
  };

  const handleWeightGoalChange = (value: number) => {
    setWeightGoal(value);
    onConfigChange({
      ...initialConfig,
      weeklyTarget,
      trainingDays,
      weightGoal: value,
      volumeGoal
    });
  };

  const handleVolumeGoalChange = (value: number) => {
    setVolumeGoal(value);
    onConfigChange({
      ...initialConfig,
      weeklyTarget,
      trainingDays,
      weightGoal,
      volumeGoal: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Weekly Target */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Sesiones semanales esperadas
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="7"
            value={weeklyTarget}
            onChange={(e) => handleWeeklyTargetChange(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
          />
          <span className="text-lg font-semibold text-slate-900 dark:text-white min-w-[3rem] text-center">
            {weeklyTarget}
          </span>
        </div>
      </div>

      {/* Training Days */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Días de entrenamiento
        </label>
        <div className="grid grid-cols-7 gap-2">
          {WEEK_DAY_LABELS.map((label, index) => (
            <button
              key={index}
              onClick={() => toggleDay(index)}
              className={`p-2 rounded-lg text-sm font-semibold transition ${
                trainingDays.includes(index)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Weight Goal */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Meta de peso (kg)
        </label>
        <input
          type="number"
          value={weightGoal}
          onChange={(e) => handleWeightGoalChange(Number(e.target.value))}
          min="1"
          step="0.5"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </div>

      {/* Volume Goal */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Meta de volumen mensual (kg·rep·set)
        </label>
        <input
          type="number"
          value={volumeGoal}
          onChange={(e) => handleVolumeGoalChange(Number(e.target.value))}
          min="100"
          step="100"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </div>
    </div>
  );
}
