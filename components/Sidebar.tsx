import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const navItems = [
  { view: AppView.DASHBOARD,           label: 'Dashboard',   icon: '⚡' },
  { view: AppView.IDEA_COPILOT,        label: 'Idea Copilot',icon: '💡' },
  { view: AppView.TASK_MANAGER,        label: 'Tasks',       icon: '📋' },
  { view: AppView.HISTORY_ANALYZER,    label: 'Hack History',icon: '📊' },
  { view: AppView.SUBMISSION_ASSISTANT,label: 'Submission',  icon: '📄' },
  { view: AppView.CHAT,                label: 'AI Expert',   icon: '🤖' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => (
  <aside className="w-20 md:w-60 bg-slate-800 border-r border-slate-700 flex flex-col h-full shrink-0">
    <div className="p-5 border-b border-slate-700">
      <div className="hidden md:block text-xl font-bold text-blue-400 tracking-tight">CrackHack</div>
      <div className="md:hidden text-xl font-bold text-blue-400 text-center">CH</div>
      <div className="hidden md:block text-xs text-slate-500 mt-0.5 font-mono">hackathon copilot</div>
    </div>

    <nav className="flex-1 p-2 space-y-1 mt-2">
      {navItems.map(item => (
        <button
          key={item.view}
          onClick={() => setView(item.view)}
          className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
            currentView === item.view
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <span className="text-lg shrink-0">{item.icon}</span>
          <span className="ml-3 hidden md:block text-sm font-semibold">{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="p-3 border-t border-slate-700 hidden md:block">
      <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Active Team</p>
        <p className="text-sm font-bold text-white mt-0.5">Team Hacktivists</p>
      </div>
    </div>
  </aside>
);

export default Sidebar;
