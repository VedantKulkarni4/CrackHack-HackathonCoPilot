import React, { useState } from 'react';
import { MOCK_HISTORICAL_DATA } from '../constants';
import { analyzeHistoricalData } from '../services/claudeService';

const HistoryAnalyzer: React.FC = () => {
  const [query, setQuery]   = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError]   = useState('');

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const insight = await analyzeHistoricalData(query.trim(), MOCK_HISTORICAL_DATA);
      setResult(insight);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'What tech stacks won most in 2024?',
    'Which themes have the most winners?',
    'What patterns do winning projects share?',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hack History 📊</h1>
        <p className="text-slate-400 text-sm mt-1 font-mono">// analyze past winners with ai</p>
      </div>

      {/* Query card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <p className="text-sm text-slate-400">
          Query the curated hackathon database to find trends, tech patterns, and winning strategies.
        </p>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-full transition-colors font-mono"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
            placeholder="Ask anything about past hackathons…"
            className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing…
              </span>
            ) : '🔍 Analyze'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">⚠️ {error}</div>
        )}

        {result && (
          <div className="bg-gradient-to-br from-blue-900/20 to-violet-900/10 border border-blue-500/20 rounded-xl p-5">
            <div className="text-xs font-bold text-blue-400 font-mono uppercase tracking-wider mb-3">AI Analysis</div>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{result}</div>
          </div>
        )}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_HISTORICAL_DATA.map(hack => (
          <div key={hack.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-base">{hack.name}</h3>
              <span className="text-xs bg-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">{hack.year}</span>
            </div>
            <p className="text-sm text-blue-400 font-semibold mb-2">🏆 {hack.winner} · {hack.theme}</p>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">{hack.projectDescription}</p>
            <div className="flex flex-wrap gap-1.5">
              {hack.techStack.map(t => (
                <span key={t} className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryAnalyzer;
