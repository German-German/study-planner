"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TaskFAB() {
  const pathname = usePathname();
  
  // Don't show the FAB on the new task page itself
  if (pathname === '/tasks/new') return null;

  return (
    <Link
      href="/tasks/new"
      className="fixed bottom-8 right-8 z-[60] flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 hover:scale-110 active:scale-95 transition-all group border-4 border-white dark:border-slate-800"
      aria-label="Create New Task"
    >
      <svg className="w-7 h-7 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
        New Task
      </span>
    </Link>
  );
}
