import React, { useState, useRef, useEffect } from 'react';
import { getExpertChatResponse, ChatMessage } from '../services/claudeService';
import { HackathonProject } from '../types';

interface AIChatProps {
  project: HackathonProject | null;
}

interface DisplayMessage {
  role: 'user' | 'bot';
  text: string;
}

const AIChat: React.FC<AIChatProps> = ({ project }) => {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: 'bot', text: "Hey! I'm your CrackHack AI Expert — a senior software architect and hackathon veteran. Ask me anything: architecture, debugging, code, pitch coaching. What are we building? 🚀" }
  ]);
  const [history, setHistory]   = useState<ChatMessage[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput('');
    setError('');
    const newDisplay: DisplayMessage[] = [...messages, { role: 'user', text: msg }];
    setMessages(newDisplay);
    const newHistory: ChatMessage[] = [...history, { role: 'user', content: msg }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const ctx = project
        ? `Current project: "${project.name}" — ${project.solution} (Stack: ${project.techStack.join(', ')})`
        : '';
      const reply = await getExpertChatResponse(newHistory, ctx);
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      setHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : 'Unknown error';
      setError(errMsg);
      setMessages(prev => [...prev, { role: 'bot', text: `⚠️ Error: ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Best architecture for my project?',
    'How should I structure my README?',
    'What makes a winning demo?',
    'Give me a 48h time breakdown',
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Expert 🤖</h1>
        <p className="text-slate-400 text-sm mt-1 font-mono">// senior software architect on demand</p>
      </div>

      <div className="flex flex-col bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-bold">CrackHack AI Expert</span>
          </div>
          <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
            Claude Sonnet
          </span>
        </div>

        {/* Quick prompts */}
        <div className="flex gap-2 px-4 py-2.5 border-b border-slate-700 flex-wrap">
          {quickPrompts.map(p => (
            <button
              key={p}
              onClick={() => { setInput(p); }}
              className="text-xs px-2.5 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-full transition-colors font-mono"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-slate-900 border border-slate-700 text-slate-200 rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                {[0, 150, 300].map(d => (
                  <span
                    key={d}
                    className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/30 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask anything technical…"
            disabled={loading}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors disabled:opacity-50 placeholder:text-slate-600"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-colors disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
