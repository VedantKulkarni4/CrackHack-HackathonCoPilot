// ─────────────────────────────────────────────
//  CrackHack · Ollama AI Service
//  All AI calls route through this file to local Ollama.
// ─────────────────────────────────────────────

const API_URL = 'http://localhost:11434/api/chat';
const MODEL   = 'llama3.2'; // commonly used fast model, adjust if using different like 'mistral' or 'phi3'

async function callOllama(
  systemPrompt: string,
  userMessage: string,
  expectJson: boolean = false
): Promise<string> {
  const reqBody: any = {
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    stream: false,
  };
  
  if (expectJson) {
    reqBody.format = 'json';
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? `API error ${res.status}`);
  return data.message.content;
}

function parseJSON<T>(raw: string): T {
  const clean = raw.replace(/\`\`\`json|\`\`\`/gi, '').trim();
  // Attempt to isolate JSON if the model included conversational text before/after
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  const firstBracket = clean.indexOf('[');
  const lastBracket = clean.lastIndexOf(']');
  
  let jsonStr = clean;
  if (firstBrace !== -1 && lastBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      jsonStr = clean.substring(firstBrace, lastBrace + 1);
  } else if (firstBracket !== -1 && lastBracket !== -1) {
      jsonStr = clean.substring(firstBracket, lastBracket + 1);
  }

  return JSON.parse(jsonStr) as T;
}

// ── Idea Copilot ─────────────────────────────
export interface IdeaResult {
  name: string;
  problem: string;
  solution: string;
  techStack: string[];
  mvpScope: string;
}

export async function generateIdea(
  theme: string,
  constraints: string
): Promise<IdeaResult[]> {
  const raw = await callOllama(
    'You are a senior hackathon strategist and former winner. Return ONLY a valid JSON array of exactly 3 ideas with no markdown fences or extra text.',
    `Generate exactly 3 distinct, highly-technical hackathon project ideas.
Theme: "${theme}"
Constraints: "${constraints || 'none'}"

Focus on modern patterns that win hackathons (e.g., Agentic AI, robust realtime architectures, solving deep technical or real-world pain points).

Return exactly this JSON shape (an array of 3 objects):
[
  {
    "name": "short catchy project name",
    "problem": "1-2 sentence real-world problem",
    "solution": "2-3 sentence technical solution description emphasizing the 'wow' factor",
    "techStack": ["Tech1", "Tech2", "Tech3", "Tech4"],
    "mvpScope": "what the working MVP will demonstrate in 48 hours"
  }
]`,
    true
  );
  return parseJSON<IdeaResult[]>(raw);
}

// ── Task Generator ────────────────────────────
export interface TaskResult {
  title: string;
  category: string;
}

export async function generateTasks(
  projectName: string,
  solution: string
): Promise<TaskResult[]> {
  const raw = await callOllama(
    'You are a hackathon project manager. Return ONLY a valid JSON array with no markdown fences or extra text.',
    `Generate 8-10 actionable tasks for a 48-hour hackathon.
Project: "${projectName}"
Solution: "${solution}"

Return exactly this JSON shape (array):
[
  { "title": "task description", "category": "Frontend | Backend | AI/ML | DevOps | Design | Research | Testing" }
]`,
    true
  );
  return parseJSON<TaskResult[]>(raw);
}

// ── History Analyzer ──────────────────────────
export async function analyzeHistoricalData(
  userQuery: string,
  data: object[]
): Promise<string> {
  return callOllama(
    'You are a hackathon data analyst. Give concise, insightful answers with bullet points where helpful.',
    `Historical hackathon data:\n${JSON.stringify(data, null, 2)}\n\nQuery: ${userQuery}`
  );
}

// ── Submission Enhancer ───────────────────────
export interface EnhancedSubmission {
  tagline: string;
  problem: string;
  solution: string;
  status: string;
}

export async function enhanceSubmission(project: {
  name: string;
  theme: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
}): Promise<EnhancedSubmission> {
  const raw = await callOllama(
    'You are a hackathon pitch copywriter. Return ONLY valid JSON with no markdown fences or extra text.',
    `Rewrite this project submission copy to be punchy, compelling, and judge-ready.
Project data: ${JSON.stringify(project)}

Return exactly this JSON shape:
{
  "tagline": "one-liner tagline max 12 words",
  "problem": "2-3 sentence problem statement make judges feel the pain",
  "solution": "2-3 sentence solution pitch focus on the wow factor",
  "status": "2-sentence project status convey ambition and completeness"
}`,
    true
  );
  return parseJSON<EnhancedSubmission>(raw);
}

// ── AI Chat (multi-turn) ──────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getExpertChatResponse(
  history: ChatMessage[],
  projectContext: string
): Promise<string> {
  const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are CrackHack AI Expert, a senior software architect and hackathon veteran.
Help with architecture, tech stack choices, code snippets, debugging, pitch coaching, and time management.
Be concise, direct, and practical. Use code blocks when showing code.
${projectContext}`
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [systemMessage, ...history],
      stream: false,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? `API error ${res.status}`);
  return data.message.content;
}
