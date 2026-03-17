import React, { useState } from 'react';
import { generateIdea, generateTasks, IdeaResult } from '../services/claudeService';
import { HackathonProject, AppView } from '../types';

interface IdeaCopilotProps {
  project: HackathonProject | null;
  setProject: (project: HackathonProject) => void;
  clearProject: () => void;
  onNavigate: (view: AppView) => void;
}

const IdeaCopilot: React.FC<IdeaCopilotProps> = ({ project, setProject, clearProject, onNavigate }) => {
  const [theme, setTheme]           = useState('');
  const [constraints, setConstraints] = useState('');
  const [generating, setGenerating] = useState(false);
  const [selecting, setSelectingId] = useState<number | null>(null);
  const [ideas, setIdeas]           = useState<IdeaResult[]>([]);
  const [error, setError]           = useState('');

  const handleGenerate = async () => {
    if (!theme.trim()) return;
    setGenerating(true);
    setError('');
    try {
      let parsed = await generateIdea(theme.trim(), constraints.trim());
      
      let newIdeas: any[] = [];
      // 1. Unwrap if the LLM returned { "ideas": [...] }
      if (!Array.isArray(parsed) && parsed !== null && typeof parsed === 'object') {
        const asObj = parsed as any;
        if (Array.isArray(asObj.ideas)) newIdeas = asObj.ideas;
        else if (Array.isArray(asObj.projects)) newIdeas = asObj.projects;
        else if (asObj.name && asObj.solution) newIdeas = [asObj]; // It's just one idea
      } else if (Array.isArray(parsed)) {
        newIdeas = parsed;
      }
      
      // 2. Validate content exists (drop completely empty parse failures)
      newIdeas = newIdeas.filter(idea => idea && idea.name && idea.solution);

      if (newIdeas.length === 0) {
        throw new Error('AI did not return any valid project ideas. Try regenerating.');
      }
      
      setIdeas(prev => [...newIdeas, ...prev] as any);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelect = async (idea: IdeaResult, idx: number) => {
    setSelectingId(idx);
    setError('');
    try {
      const taskList = await generateTasks(idea.name, idea.solution);
      const newProject: HackathonProject = {
        name: idea.name,
        theme,
        problemStatement: idea.problem,
        solution: idea.solution,
        techStack: idea.techStack,
        tasks: taskList.map((t, i) => ({
          id: String(i),
          title: t.title,
          category: t.category,
          status: 'todo' as const,
        })),
      };
      setProject(newProject);
      onNavigate(AppView.TASK_MANAGER);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate tasks');
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Idea Copilot 💡</h1>
        <p className="text-slate-400 text-sm mt-1 font-mono">// ai-powered concept generator</p>
      </div>

      {/* Active project banner */}
      {project && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Active Project</div>
            <div className="text-white font-bold">{project.name}</div>
            <div className="text-slate-400 text-xs mt-0.5">{project.theme} · {project.tasks.length} tasks</div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onNavigate(AppView.TASK_MANAGER)}
              className="text-xs px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
            >
              View Tasks →
            </button>
            <button
              onClick={clearProject}
              className="text-xs px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-400 rounded-lg font-bold transition-colors"
            >
              🗑 Remove & Start Fresh
            </button>
          </div>
        </div>
      )}

      {/* Input card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
              Hackathon Theme *
            </label>
            <input
              type="text"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. FinTech, Sustainability, AI-First…"
              className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors placeholder:text-slate-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
              Constraints / Focus
            </label>
            <input
              type="text"
              value={constraints}
              onChange={e => setConstraints(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. Mobile only, must use blockchain…"
              className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors placeholder:text-slate-600"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating || !theme.trim()}
          className="w-full py-4 rounded-xl font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-900/20"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Consulting Claude AI…
            </span>
          ) : '✨ Generate Winning Idea'}
        </button>
      </div>

      {/* Ideas grid */}
      {ideas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ideas.map((idea, idx) => (
            <div
              key={idx}
              className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 transition-colors flex flex-col"
            >
              <h3 className="text-lg font-bold text-blue-400 mb-2">🚀 {idea.name}</h3>
              <p className="text-slate-400 text-sm italic mb-3 leading-relaxed">"{idea.problem}"</p>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">{idea.solution}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {(Array.isArray(idea.techStack) ? idea.techStack : []).map(t => (
                  <span key={t} className="px-2 py-0.5 bg-slate-700 border border-slate-600 rounded text-xs font-mono text-slate-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="bg-violet-900/20 border border-violet-500/20 rounded-lg px-3 py-2 mb-5">
                <span className="text-xs font-bold text-violet-400 font-mono uppercase tracking-wider">MVP: </span>
                <span className="text-xs text-slate-300">{idea.mvpScope}</span>
              </div>

              <button
                onClick={() => handleSelect(idea, idx)}
                disabled={selecting !== null}
                className="mt-auto w-full py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-700 hover:bg-blue-600"
              >
                {selecting === idx ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating tasks…
                  </span>
                ) : '✅ Select & Build Task List'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdeaCopilot;
