'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@lib/supabase-client';
import { useSupabaseSession } from '@hooks/useSupabaseSession';

const navItems: { href: string; icon: string; label: string }[] = [
  { href: '/', icon: '🏠', label: 'Inicio' },
  { href: '/goals', icon: '🎯', label: 'Objetivos' },
  { href: '/calendar', icon: '📅', label: 'Calendario' },
  { href: '/analytics', icon: '📊', label: 'Analítica' },
  { href: '/settings', icon: '⚙️', label: 'Ajustes' }
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useSupabaseSession();
  const supabase = createBrowserSupabaseClient();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user')
        .then(res => res.json())
        .then(data => {
          const displayName = data.name || data.firstName || data.email;
          setUserName(displayName);
        })
        .catch(() => setUserName(session.user.email || 'Usuario'));
    }
  }, [session]);

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return isActive
      ? 'rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-200/50'
      : 'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800';
  };

  return (
    <nav className="mb-8 rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="flex items-center justify-center w-10 h-10">
            <img src="/image-no-background-500x500.png" alt="Goalyx Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Goalyx</p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Sistema de seguimiento</h2>
          </div>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href as any} className={getLinkClasses(item.href)} title={item.label}>
              <span aria-hidden="true">{item.icon}</span>
            </Link>
          ))}
          {session?.user && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-slate-700 dark:text-slate-200">{userName}</span>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/login');
                }}
                className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
