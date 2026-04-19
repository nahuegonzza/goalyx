'use client';

import { useEffect, useState } from 'react';
import Navigation from '@components/Navigation';
import ThemeToggle from '@components/ThemeToggle';
import ModuleTile from '@components/ModuleTile';
import type { Module } from '@types';

export default function SettingsPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModules() {
      try {
        const res = await fetch('/api/modules');
        const data = await res.json();
        setModules(data);
      } finally {
        setLoading(false);
      }
    }

    loadModules();
  }, []);

  const [exportLoading, setExportLoading] = useState(false);

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const [goalsRes, entriesRes, eventsRes, modulesRes, moduleEntriesRes] = await Promise.all([
        fetch('/api/goals'),
        fetch('/api/goalEntries'),
        fetch('/api/events'),
        fetch('/api/modules'),
        fetch('/api/moduleEntries')
      ]);

      if (!goalsRes.ok || !entriesRes.ok || !eventsRes.ok || !modulesRes.ok || !moduleEntriesRes.ok) {
        alert('Error al exportar datos');
        return;
      }

      const data = {
        goals: await goalsRes.json(),
        entries: await entriesRes.json(),
        events: await eventsRes.json(),
        modules: await modulesRes.json(),
        moduleEntries: await moduleEntriesRes.json(),
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `objetives-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error al exportar datos');
    } finally {
      setExportLoading(false);
    }
  };

  const handleToggleModule = async (moduleId: string, active: boolean) => {
    try {
      const res = await fetch(`/api/modules/${moduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
      if (res.ok) {
        setModules(modules.map(m => m.id === moduleId ? { ...m, active } : m));
      }
    } catch (error) {
      console.error('Error toggling module:', error);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-6 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Navigation />

        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Configuración</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Personaliza tu experiencia</p>
        </header>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Apariencia</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Modo oscuro</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Cambia entre tema claro y oscuro</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Módulos</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Activa módulos adicionales para funcionalidades extra</p>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {modules.map((module) => (
                  <ModuleTile
                    key={module.id}
                    module={module}
                    onToggle={handleToggleModule}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Datos</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Exporta tus datos para respaldo</p>
            <button
              type="button"
              onClick={handleExportData}
              disabled={exportLoading}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 text-sm font-semibold transition"
            >
              {exportLoading ? 'Exportando...' : 'Exportar Datos'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}