import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6 sm:p-24 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="z-10 max-w-4xl w-full items-center justify-center font-sans text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 drop-shadow-sm">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Study Planner</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Your personal companion for academic success. Organize your tasks, track your deadlines, and reach your goals with ease.
        </p>
        
        <Link 
          href="/tasks"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:scale-105 hover:shadow-xl active:scale-95"
        >
          View Tasks
          <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
