# AI Clipping — Starter Scaffold

This repository is a starter scaffold for a single-user AI clipping app (inspired by crayo.ai).

Overview
- Frontend: Next.js + TypeScript (Vercel)
- Backend: Node.js + TypeScript (Express) — Dockerized for Render
- Simple single-user auth (JWT). Default user email: neon32206@gmail.com (set via env)
- Content input: VOD URLs (Twitch/YouTube) and file uploads
- FFmpeg-based worker placeholders for clip generation

How to use
1. Add secrets in Render / Vercel / local .env based on .env.example.
2. Deploy frontend to Vercel (point to `frontend/` folder). Set environment variables there.
3. Deploy backend to Render as a Web Service using Dockerfile in `backend/`.
4. After deployment, open the frontend and login with the single-user email and password from your env.

Files included are a minimal scaffold and TODOs for adding real integrations (Twitch/YouTube fetch, transcription, OpenAI metadata generation, thumbnail generator).

Security & Privacy
- This repo was created as a starter. Keep the repo private if you want exclusive control of the code.
- Store secrets in Render/Vercel environment settings. Do not check secrets into the repo.

Next steps (recommended)
- Implement highlight detection (FFmpeg heuristics / ML)
- Integrate Whisper/STT or cloud transcription
- Integrate OpenAI for titles/descriptions and thumbnail prompts
- Add persistent storage (S3) for outputs and signed URLs
- Add an authenticated admin UI for job management

