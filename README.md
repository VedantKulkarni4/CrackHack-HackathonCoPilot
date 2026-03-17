# ⚡ CrackHack — Hackathon Copilot

Your AI-powered command center for winning hackathons in 48 hours.

## Features

- 🧠 **Idea Copilot** — Generate 3 distinct, trend-driven hackathon ideas using a local AI model
- 📋 **Task Manager** — Auto-generate and track your project tasks
- 📦 **Submission Assistant** — Polish your pitch and export it as a PDF
- 📊 **Dashboard** — Live countdown timer and project progress tracker
- 🔍 **Hack History Analyzer** — Query past hackathon data for insights
- 💬 **AI Expert Chat** — Multi-turn conversation with your personal hackathon mentor

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **AI Backend:** [Ollama](https://ollama.com/) running locally (no API keys needed!)

## Run Locally

**Prerequisites:** Node.js, [Ollama](https://ollama.com/)

1. Install and start Ollama:
   ```bash
   ollama pull llama3.2
   ollama serve
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`

> **No API keys required.** All AI runs locally via Ollama.
