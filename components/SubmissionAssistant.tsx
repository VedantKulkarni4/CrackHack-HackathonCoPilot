import React, { useState } from 'react';
import { HackathonProject } from '../types';
import { enhanceSubmission, EnhancedSubmission } from '../services/claudeService';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface SubmissionAssistantProps {
  project: HackathonProject | null;
}

const SubmissionAssistant: React.FC<SubmissionAssistantProps> = ({ project }) => {
  const [enhancing, setEnhancing] = useState(false);
  const [enhanced, setEnhanced]   = useState<EnhancedSubmission | null>(null);
  const [error, setError]         = useState('');
  const [copied, setCopied]       = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = () => {
    setExporting(true);
    const element = document.getElementById('submission-content');
    
    // PDF configuration options to make it look professional
    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
      filename:     `${project?.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'project'}_submission.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, backgroundColor: '#0f172a' }, // match the dark slate-900 bg
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setExporting(false);
    });
  };

  if (!project) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-16 text-center space-y-3">
        <div className="text-5xl">📄</div>
        <h2 className="text-2xl font-bold">No Active Project</h2>
        <p className="text-slate-400 text-sm">Generate a project first to build submission docs.</p>
      </div>
    );
  }

  const base = {
    tagline: `${project.name}: Revolutionizing ${project.theme}`,
    problem: project.problemStatement,
    solution: project.solution,
    stack: project.techStack.join(', '),
    status: 'Beta — fully functional MVP built in 48 hours.',
  };

  const sections: { key: string; label: string; content: string }[] = [
    { key: 'tagline', label: 'Tagline',        content: enhanced?.tagline ?? base.tagline },
    { key: 'problem', label: 'The Problem',    content: enhanced?.problem ?? base.problem },
    { key: 'solution',label: 'Our Solution',   content: enhanced?.solution ?? base.solution },
    { key: 'stack',   label: 'Tech Stack',     content: base.stack },
    { key: 'status',  label: 'Project Status', content: enhanced?.status ?? base.status },
  ];

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleEnhance = async () => {
    setEnhancing(true);
    setError('');
    try {
      const result = await enhanceSubmission({
        name: project.name,
        theme: project.theme,
        problemStatement: project.problemStatement,
        solution: project.solution,
        techStack: project.techStack,
      });
      setEnhanced(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Enhancement failed');
    } finally {
      setEnhancing(false);
    }
  };

  const copyAll = () => {
    const full = sections.map(s => `## ${s.label}\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(full);
    setCopied('all');
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submission Assistant 📄</h1>
        <p className="text-slate-400 text-sm mt-1 font-mono">// devfolio & devpost ready docs</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleEnhance}
          disabled={enhancing}
          className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg"
        >
          {enhancing ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              AI Enhancing…
            </span>
          ) : '✨ AI-Enhance All Sections'}
        </button>
        <button
          onClick={copyAll}
          className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl font-bold text-sm transition-colors"
        >
          {copied === 'all' ? '✅ Copied All!' : '📋 Copy Full Submission'}
        </button>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl font-bold text-sm transition-colors flex items-center justify-center min-w-[150px]"
        >
          {exporting ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Exporting...
            </span>
          ) : '📥 Export as PDF'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">⚠️ {error}</div>
      )}

      {enhanced && (
        <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg px-4 py-2.5 text-xs text-emerald-400 font-mono">
          ✅ Sections enhanced by Claude AI — copy-paste ready for Devfolio/Devpost
        </div>
      )}

      {/* Sections Wrapper for PDF Export */}
      <div id="submission-content" className="space-y-4 rounded-xl">
        {sections.map(s => (
          <div key={s.key} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-blue-400 font-mono uppercase tracking-widest">{s.label}</span>
              <button
                onClick={() => copy(s.content, s.key)}
                className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-semibold"
              >
                {copied === s.key ? '✅ Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap min-h-12">
              {s.content}
            </div>
          </div>
        ))}
      </div>

      {/* Pitch tips */}
      <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/10 border border-violet-500/20 rounded-2xl p-6">
        <h3 className="text-base font-bold mb-4">🎯 Winning Pitch Structure</h3>
        <div className="space-y-3">
          {[
            'Hook: Open with a real-world scenario — make judges feel the pain immediately.',
            'Demo first: Show the working product early. "Aha!" moments beat slideshows every time.',
            'Scalability: Paint the post-hackathon vision. Judges fund dreams, not just MVPs.',
          ].map((tip, i) => (
            <div key={i} className="flex gap-3 items-start text-sm text-slate-300">
              <span className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionAssistant;
