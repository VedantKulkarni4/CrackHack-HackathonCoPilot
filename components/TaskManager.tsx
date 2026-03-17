import React, { useState } from 'react';
import { HackathonProject, Task } from '../types';

interface TaskManagerProps {
  project: HackathonProject | null;
  setProject: (project: HackathonProject) => void;
}

const COLUMNS: { title: string; status: Task['status']; colorClass: string; headerClass: string }[] = [
  { title: 'To Do',       status: 'todo',        colorClass: 'border-slate-600',   headerClass: 'bg-slate-700/60 text-slate-300'   },
  { title: 'In Progress', status: 'in-progress',  colorClass: 'border-blue-500/40', headerClass: 'bg-blue-600/20 text-blue-300'    },
  { title: 'Done ✓',      status: 'done',         colorClass: 'border-emerald-500/40', headerClass: 'bg-emerald-600/20 text-emerald-300' },
];

const STATUS_CYCLE: Record<Task['status'], Task['status']> = {
  'todo': 'in-progress',
  'in-progress': 'done',
  'done': 'todo',
};

const TaskManager: React.FC<TaskManagerProps> = ({ project, setProject }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Frontend');

  if (!project) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-16 text-center space-y-3">
        <div className="text-5xl">📋</div>
        <h2 className="text-2xl font-bold">No Active Project</h2>
        <p className="text-slate-400 text-sm">Go to Idea Copilot to generate a project and tasks.</p>
      </div>
    );
  }

  const advance = (taskId: string) => {
    setProject({
      ...project,
      tasks: project.tasks.map(t =>
        t.id === taskId ? { ...t, status: STATUS_CYCLE[t.status] } : t
      ),
    });
  };

  const addTask = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      status: 'todo',
    };
    setProject({ ...project, tasks: [...project.tasks, task] });
    setNewTitle('');
  };

  const deleteTask = (taskId: string) => {
    setProject({ ...project, tasks: project.tasks.filter(t => t.id !== taskId) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-slate-400 text-sm mt-1 font-mono">// click a task to advance · {project.tasks.filter(t=>t.status==='done').length}/{project.tasks.length} done</p>
      </div>

      {/* Add task row */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-bold text-slate-500 font-mono uppercase tracking-wider mb-1.5">New Task</label>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Task title…"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 font-mono uppercase tracking-wider mb-1.5">Category</label>
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
          >
            {['Frontend','Backend','AI/ML','DevOps','Design','Research','Testing'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          onClick={addTask}
          disabled={!newTitle.trim()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors disabled:opacity-40"
        >
          + Add Task
        </button>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map(col => {
          const colTasks = project.tasks.filter(t => t.status === col.status);
          return (
            <div key={col.status} className={`bg-slate-800/60 border ${col.colorClass} rounded-2xl p-4 min-h-80`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded font-mono ${col.headerClass}`}>
                  {col.title}
                </span>
                <span className="text-xs text-slate-500 font-mono">{colTasks.length}</span>
              </div>
              <div className="space-y-2">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl p-3.5 cursor-pointer transition-colors group"
                    onClick={() => advance(task.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-bold text-violet-400 uppercase tracking-wide mb-1.5 font-mono">
                        {task.category}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 text-xs transition-opacity ml-2"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm font-medium leading-snug">{task.title}</p>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <p className="text-xs text-slate-600 text-center py-6 italic">Empty</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskManager;
