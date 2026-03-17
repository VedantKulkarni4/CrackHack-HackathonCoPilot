# CrackHack — Complete Setup & Build Guide
## Step-by-Step: Zero to Working App

---

## WHAT CHANGED FROM YOUR PROTOTYPE

| Old (Broken) | Fixed |
|---|---|
| `@google/genai` Gemini SDK | Native `fetch` to Claude Anthropic API |
| `process.env.API_KEY` (Vite incompatible) | `import.meta.env.VITE_ANTHROPIC_API_KEY` |
| `gemini-3-flash-preview` (doesn't exist) | `claude-sonnet-4-20250514` |
| `ImageEditor` using broken image model | Removed (optional add-back) |
| TypeScript crashing (TS language service) | Fixed types, removed `@google/genai` dep |
| `importmap` in index.html fighting Vite | Removed — Vite handles all imports |
| Static timer on dashboard | Live countdown with start/pause |
| No task delete, no manual task add | Both added to TaskManager |
| AI Chat no conversation history | Full multi-turn history maintained |
| Submission sections static only | AI-Enhance button rewrites all sections |

---

## STEP 1 — GET YOUR ANTHROPIC API KEY

1. Go to **https://console.anthropic.com**
2. Sign in or create an account
3. Navigate to **API Keys** → click **Create Key**
4. Copy the key (starts with `sk-ant-...`) — you only see it once

---

## STEP 2 — REPLACE YOUR PROJECT FILES

Replace these files in your project root with the fixed versions:

```
crackhack/
├── .env.local                          ← ADD YOUR KEY HERE
├── index.html                          ← fixed (removed importmap)
├── index.tsx                           ← fixed (React 18 createRoot)
├── package.json                        ← fixed (removed @google/genai)
├── vite.config.ts                      ← fixed (simplified)
├── types.ts                            ← fixed (removed ImageEditor view)
├── App.tsx                             ← fixed (removed ImageEditor)
├── constants.ts                        ← unchanged
├── services/
│   └── claudeService.ts                ← NEW (replaces geminiService.ts)
└── components/
    ├── Sidebar.tsx                     ← fixed
    ├── Dashboard.tsx                   ← fixed (live timer)
    ├── IdeaCopilot.tsx                 ← fixed (Claude AI)
    ├── TaskManager.tsx                 ← fixed (add/delete tasks)
    ├── HistoryAnalyzer.tsx             ← fixed (Claude AI)
    ├── SubmissionAssistant.tsx         ← fixed (AI-Enhance button)
    └── AIChat.tsx                      ← fixed (multi-turn history)
```

**Delete these files** (no longer needed):
- `services/geminiService.ts`
- `components/ImageEditor.tsx`

---

## STEP 3 — SET YOUR API KEY

Open `.env.local` and replace the placeholder:

```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-YOUR-ACTUAL-KEY-HERE
```

⚠️ **Rules:**
- Must start with `VITE_` — Vite only exposes env vars with this prefix to the browser
- Never commit this file to Git (it's in `.gitignore`)
- Never share this key publicly

---

## STEP 4 — INSTALL DEPENDENCIES & RUN

```bash
# Navigate to your project folder
cd crackhack

# Install dependencies (React 18, no more @google/genai)
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## STEP 5 — TEST EACH FEATURE

### ✅ Feature 1: Idea Copilot
1. Click **Idea Copilot** in sidebar
2. Enter a theme: `"Healthcare AI"`
3. Enter constraints: `"Mobile app, must work offline"`
4. Click **Generate Winning Idea**
5. Wait ~3–5 seconds → idea card appears
6. Click **Select & Build Task List** on any idea
7. Wait ~3–5 seconds → auto-redirects to Task Manager with 8–10 tasks

**What Claude generates:** Project name, problem statement, solution, tech stack, MVP scope, and a full task list.

---

### ✅ Feature 2: Task Manager (Kanban)
After generating an idea:
1. Click **Tasks** in sidebar
2. You'll see tasks spread across **To Do / In Progress / Done**
3. **Click any task card** to advance it to the next status
4. Use the **+ Add Task** row at the top to manually add tasks
5. **Hover a task** → click the `✕` to delete it
6. Progress syncs live to the Dashboard

---

### ✅ Feature 3: Dashboard
1. Click **Dashboard** in sidebar
2. See live stats: tasks done, remaining, % progress
3. Click **▶ Start Timer** to start the 48-hour countdown
4. Click again to pause

---

### ✅ Feature 4: Hack History Analyzer
1. Click **Hack History** in sidebar
2. Click one of the suggestion chips (or type your own query)
3. Example: *"What tech stacks won most in 2024?"*
4. Click **🔍 Analyze**
5. Claude analyzes the historical database and returns insights

---

### ✅ Feature 5: Submission Assistant
1. Complete Idea Copilot first (needs an active project)
2. Click **Submission** in sidebar
3. See auto-generated sections: Tagline, Problem, Solution, Tech Stack, Status
4. Click **Copy** on any section to copy to clipboard
5. Click **✨ AI-Enhance All Sections** → Claude rewrites everything to be punchy and judge-ready
6. Click **📋 Copy Full Submission** to copy everything at once for Devfolio/Devpost

---

### ✅ Feature 6: AI Expert Chat
1. Click **AI Expert** in sidebar
2. Click a quick-prompt chip or type your own question
3. Press **Enter** or click **Send**
4. Claude responds as a senior software architect
5. Full conversation history is maintained — it remembers the thread
6. If you have an active project, Claude knows your tech stack and gives context-aware advice

---

## STEP 6 — FIX COMMON ERRORS

### Error: "VITE_ANTHROPIC_API_KEY is not set"
→ Check `.env.local` exists and has the key starting with `VITE_`
→ Restart the dev server after editing `.env.local`

### Error: "401 Unauthorized"
→ Your API key is wrong or expired
→ Go to console.anthropic.com and generate a new key

### Error: "403 Forbidden" or CORS error
→ Make sure you're calling from localhost (not a deployed server)
→ The `anthropic-dangerous-direct-browser-calls: true` header enables browser-to-API calls

### TypeScript errors in VS Code ("language service crashed")
→ Run: `npm install` again
→ In VS Code: Cmd/Ctrl+Shift+P → "TypeScript: Restart TS Server"

### Ideas/tasks not generating
→ Open browser DevTools → Network tab → check the `/v1/messages` request
→ Look at the response body for the error message

---

## PROJECT STRUCTURE (FINAL)

```
crackhack/
├── .env.local              # Your API key (never commit)
├── index.html              # App entry point
├── index.tsx               # React root mount
├── App.tsx                 # View router + shared state
├── types.ts                # TypeScript types
├── constants.ts            # Mock historical data
├── vite.config.ts          # Build config
├── package.json
├── tsconfig.json
├── services/
│   └── claudeService.ts    # ALL Claude API calls live here
└── components/
    ├── Sidebar.tsx          # Navigation
    ├── Dashboard.tsx        # Stats + timer
    ├── IdeaCopilot.tsx      # Idea generation
    ├── TaskManager.tsx      # Kanban board
    ├── HistoryAnalyzer.tsx  # Past hackathon analysis
    ├── SubmissionAssistant.tsx  # Docs + AI enhance
    └── AIChat.tsx           # Multi-turn AI chat
```

---

## HOW THE CLAUDE API WORKS (for your reference)

Every AI call in `claudeService.ts` follows this pattern:

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': YOUR_API_KEY,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-calls': 'true',  // required for browser
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: 'You are....',   // sets Claude's role
    messages: [{ role: 'user', content: 'your prompt' }],
  }),
});
```

For **structured output** (ideas, tasks): prompt Claude to return JSON only, then `JSON.parse()` the result.
For **free text** (history analysis, chat): just use the text response directly.
For **multi-turn chat**: pass the full `messages` array with alternating user/assistant turns.

---

## OPTIONAL: ADD BACK IMAGE EDITOR

If you want the Image Editor feature back, you'll need a different approach since Gemini's image editing model doesn't have a direct Claude equivalent. Options:
- Use **Cloudinary AI** for image editing
- Use **Replicate API** (Stable Diffusion)
- Use a simple canvas-based editor (no AI)

---

*Built with React 18 + Vite + TypeScript + Claude AI*
