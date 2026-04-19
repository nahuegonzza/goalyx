import type { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function DashboardCard({ title, description, children }: DashboardCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
