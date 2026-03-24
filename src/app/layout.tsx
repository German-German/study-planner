import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import ProfileMenu from "@/components/ProfileMenu";
import TaskFAB from "@/components/TaskFAB";

export const metadata: Metadata = {
  title: "Study Planner",
  description: "Your personal companion for academic success",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-x-hidden">
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-8">
              <a href="/" className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                StudyPlanner
              </a>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                <a href="/" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Home</a>
                <a href="/tasks" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Tasks</a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="md:hidden flex items-center gap-3 mr-2">
                 <a href="/tasks" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">Tasks</a>
              </div>
              <ProfileMenu />
            </div>
          </div>
        </nav>
        
        <div className="flex-1 flex flex-col relative">
          {children}
          <TaskFAB />
        </div>
        
        {/* Extra padding at bottom for mobile to avoid FAB overlapping content */}
        <div className="h-20 sm:hidden pointer-events-none" />
      </body>
    </html>
  );
}
