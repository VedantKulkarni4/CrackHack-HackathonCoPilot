export enum AppView {
  DASHBOARD          = 'DASHBOARD',
  IDEA_COPILOT       = 'IDEA_COPILOT',
  TASK_MANAGER       = 'TASK_MANAGER',
  SUBMISSION_ASSISTANT = 'SUBMISSION_ASSISTANT',
  HISTORY_ANALYZER   = 'HISTORY_ANALYZER',
  CHAT               = 'CHAT',
}

export interface HackathonProject {
  name: string;
  theme: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  category: string;
}

export interface HistoricalHackathon {
  id: string;
  name: string;
  year: number;
  winner: string;
  theme: string;
  projectDescription: string;
  techStack: string[];
}
