import React, { useState, useEffect, useRef } from 'react';
import { AppView, HackathonProject } from '../types';

interface DashboardProps {
  project: HackathonProject | null;
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ project, onNavigate }) => {
  const [seconds, setSeconds] = useState(48 * 3600);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load timer state on mount
  useEffect(() => {
    try {
      const savedRunning = localStorage.getItem('crackhack_timer_running') === 'true';
      const savedEndTime = localStorage.getItem('crackhack_timer_end');
      const savedSeconds = localStorage.getItem('crackhack_timer_remaining');
      
      if (savedRunning && savedEndTime) {
        const remaining = Math.max(0, Math.floor((parseInt(savedEndTime) - Date.now()) / 1000));
        setSeconds(remaining);
        setRunning(true);
      } else if (savedSeconds) {
        setSeconds(parseInt(savedSeconds));
        setRunning(false);
      }
    } catch (_) {}
  }, []);

  // Update timer remaining and calculate End Time if running
  useEffect(() => {
    if (running) {
      // Whenever we start running, lock in the exact end time based on current seconds left
      const targetEndTime = Date.now() + (seconds * 1000);
      localStorage.setItem('crackhack_timer_end', targetEndTime.toString());
      localStorage.setItem('crackhack_timer_running', 'true');
      
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          const newS = Math.max(0, s - 1);
          localStorage.setItem('crackhack_timer_remaining', newS.toString());
          return newS;
        });
      }, 1000);
    } else {
      localStorage.setItem('crackhack_timer_running', 'false');
      localStorage.setItem('crackhack_timer_remaining', seconds.toString());
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const fmt = (n: number) => String(n).padStart(2, '0');
  const h = fmt(Math.floor(seconds / 3600));
  const m = fmt(Math.floor((seconds % 3600) / 60));
  const s = fmt(seconds % 60);

  const done  = project?.tasks.filter(t => t.status === 'done').length ?? 0;
  const total = project?.tasks.length ?? 0;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  
  const pendingTasks = project?.tasks.filter(t => t.status !== 'done').slice(0, 2) ?? [];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">War Room ⚡</h1>
          <p className="text-slate-400 text-sm mt-1 font-mono">// hackathon command center</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1.5 flex justify-end items-center gap-2">
            Time Remaining
            {running && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
          </div>
          <div className={`text-4xl font-mono font-extrabold tracking-tight ${seconds < 3600 ? 'text-red-400' : 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.3)]'}`}>
            {h}:{m}:{s}
          </div>
          <button
            onClick={() => setRunning(r => !r)}
            className={`mt-3 text-xs px-4 py-2 rounded-lg font-bold transition-all shadow-lg backdrop-blur-sm border ${
              running 
                ? 'bg-red-900/20 text-red-400 border-red-500/30 hover:bg-red-900/40' 
                : 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40'
            }`}
          >
            {running ? '⏸ Pause Timer' : '▶ Start Timer'}
          </button>
        </div>
      </div>

      {!project ? (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-16 text-center space-y-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">🚀</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">No Active Project</h2>
          <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
            Fire up the Idea Copilot to generate a winning concept and initialize your hackathon project.
          </p>
          <button
            onClick={() => onNavigate(AppView.IDEA_COPILOT)}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
          >
            Start Ideating →
          </button>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { value: done,  label: 'Tasks Done',    color: 'text-emerald-400', bg: 'from-emerald-900/20 to-transparent', border: 'border-emerald-500/20' },
              { value: total - done, label: 'Remaining', color: 'text-blue-400', bg: 'from-blue-900/20 to-transparent', border: 'border-blue-500/20' },
              { value: `${pct}%`,  label: 'Progress',   color: 'text-violet-400', bg: 'from-violet-900/20 to-transparent', border: 'border-violet-500/20' },
            ].map(({ value, label, color, bg, border }) => (
              <div key={label} className={`bg-gradient-to-br ${bg} bg-slate-800/40 backdrop-blur-md border ${border} rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
                <div className={`text-4xl font-extrabold font-mono ${color} drop-shadow-md`}>{value}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">{label}</div>
              </div>
            ))}
          </div>

          {/* Project card */}
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Header & Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">{project.name}</h2>
                <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                  {project.theme}
                </span>
              </div>
              <button
                onClick={() => onNavigate(AppView.TASK_MANAGER)}
                className="text-sm px-6 py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-500/30 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 group"
              >
                View All Tasks 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* Problem Statement */}
            <div className="relative z-10 bg-slate-900/50 rounded-2xl p-5 border border-slate-700/50">
              <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-violet-500 pl-4 italic">
                "{project.problemStatement}"
              </p>
            </div>

            {/* Progress Bar Area */}
            <div className="relative z-10 space-y-3">
              <div className="flex justify-between text-sm items-end">
                <span className="text-slate-400 font-bold tracking-wide uppercase text-xs">Mission Progress</span>
                <span className="font-mono font-bold text-slate-300">{done} / {total} tasks</span>
              </div>
              <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-[1500ms] ease-out relative"
                  style={{ width: `${pct}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pt-4 border-t border-slate-700/50">
              {/* Coming up next tasks */}
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  Up Next Focus
                </div>
                {pendingTasks.length > 0 ? (
                  <div className="space-y-2">
                    {pendingTasks.map(t => (
                      <div key={t.id} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 flex items-start gap-3 text-sm group cursor-pointer hover:border-violet-500/50 transition-colors" onClick={() => onNavigate(AppView.TASK_MANAGER)}>
                         <div className="mt-0.5 w-4 h-4 rounded border-2 border-slate-500 flex-shrink-0 group-hover:border-violet-400 transition-colors" />
                         <span className="text-slate-300 group-hover:text-white transition-colors line-clamp-2">{t.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm font-bold text-emerald-400 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-center h-[90px]">
                    🎉 All caught up! Time to launch!
                  </div>
                )}
              </div>

               {/* Tech Stack */}
               <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Tech Stack Arsenal
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(t => (
                    <span key={t} className="px-3 py-1.5 bg-slate-900/80 border border-blue-500/20 rounded-lg text-xs font-mono font-bold text-blue-300 shadow-sm hover:border-blue-500/50 transition-colors cursor-default">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
