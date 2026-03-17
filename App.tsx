import React, { useState, useEffect } from 'react';
import { AppView, HackathonProject } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IdeaCopilot from './components/IdeaCopilot';
import TaskManager from './components/TaskManager';
import SubmissionAssistant from './components/SubmissionAssistant';
import HistoryAnalyzer from './components/HistoryAnalyzer';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const saved = localStorage.getItem('crackhack_view');
      return saved ? (saved as AppView) : AppView.DASHBOARD;
    } catch {
      return AppView.DASHBOARD;
    }
  });
  const [project, setProject] = useState<HackathonProject | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('crackhack_project');
      if (saved) setProject(JSON.parse(saved));
    } catch (_) {}
  }, []);

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    localStorage.setItem('crackhack_view', view);
  };

  const clearProject = () => {
    setProject(null);
    localStorage.removeItem('crackhack_project');
  };

  const updateProject = (newProject: HackathonProject) => {
    setProject(newProject);
    localStorage.setItem('crackhack_project', JSON.stringify(newProject));
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard project={project} onNavigate={handleNavigate} />;
      case AppView.IDEA_COPILOT:
        return <IdeaCopilot project={project} setProject={updateProject} clearProject={clearProject} onNavigate={handleNavigate} />;
      case AppView.TASK_MANAGER:
        return <TaskManager project={project} setProject={updateProject} />;
      case AppView.SUBMISSION_ASSISTANT:
        return <SubmissionAssistant project={project} />;
      case AppView.HISTORY_ANALYZER:
        return <HistoryAnalyzer />;
      case AppView.CHAT:
        return <AIChat project={project} />;
      default:
        return <Dashboard project={project} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <Sidebar currentView={currentView} setView={handleNavigate} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
