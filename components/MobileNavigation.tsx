'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, TargetIcon, CalendarIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, TargetIcon as TargetIconSolid, CalendarIcon as CalendarIconSolid, ChartBarIcon as ChartBarIconSolid, CogIcon as CogIconSolid } from '@heroicons/react/24/solid';

const navItems = [
  { href: '/goals', icon: TargetIcon, solidIcon: TargetIconSolid, label: 'Objetivos' },
  { href: '/calendar', icon: CalendarIcon, solidIcon: CalendarIconSolid, label: 'Calendario' },
  { href: '/', icon: HomeIcon, solidIcon: HomeIconSolid, label: 'Inicio' },
  { href: '/analytics', icon: ChartBarIcon, solidIcon: ChartBarIconSolid, label: 'Analítica' },
  { href: '/settings', icon: CogIcon, solidIcon: CogIconSolid, label: 'Ajustes' }
];

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-2 flex justify-around items-center z-50 shadow-lg">
      {navItems.slice(0, 2).map((item) => {
        const Icon = pathname === item.href ? item.solidIcon : item.icon;
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors">
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
      <div className="flex flex-col items-center p-2">
        <Link href="/" className={`flex items-center justify-center w-12 h-12 rounded-full ${pathname === '/' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} hover:bg-emerald-500 transition-colors`}>
          <HomeIconSolid className="w-6 h-6" />
        </Link>
        <span className="text-xs mt-1 text-slate-600 dark:text-slate-400">Inicio</span>
      </div>
      {navItems.slice(3).map((item) => {
        const Icon = pathname === item.href ? item.solidIcon : item.icon;
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors">
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}