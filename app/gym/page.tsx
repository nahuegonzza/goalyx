'use client';

import Navigation from '@components/Navigation';
import GymDashboard from '@modules/gym/GymDashboard';

export default function GymPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Navigation />

        <section className="mb-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600 dark:text-rose-400">Módulo</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Gimnasio</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                  Un espacio diseñado para registrar asistencia, entrenamientos detallados y progresos físicos sin perder la estética premium de Goalyx.
                </p>
              </div>
            </div>
          </div>
        </section>

        <GymDashboard />
      </div>
    </main>
  );
}
