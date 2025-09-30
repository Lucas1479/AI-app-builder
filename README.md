## Mini AI App Builder Portal (Demo)

A small demo that captures a user's app idea, extracts structured requirements using an AI API (or a built-in mock), and renders a simple generated UI (forms/menus) based on those requirements.

- **Tech stack**: React (frontend) + Node.js/Express (backend) + MongoDB (Atlas) + optional Google Generative AI (Gemini)
- **Deployment**: Works locally or on Render (Static Site for frontend + Web Service for backend)

---

## Features
- **Requirement Capture**
  - A text input for the user to describe the app idea
  - Submit to backend for AI-driven extraction (falls back to mock if AI key is not set)
  - Extracted structure includes: `appName`, `entities`, `roles`, `features`, `rolePermissions`
- **Generated UI (Mock)**
  - Auto-generate basic forms for entities with common field types (text/email/number/date/select/textarea)
  - Simple navigation for roles/features (tabs/menus)
  - Demo-only; not intended for full CRUD or real auth
- **Health & Status**
  - `GET /api/health` for service health
  - `GET /api/apps/ai-status` to check whether real AI is configured

---

## Project Structure (Brief)
- `frontend/` React client
  - Uses `REACT_APP_API_URL` to reach backend `/api`
- `backend/` Node/Express API
  - Routes prefixed by `/api/apps`
  - Reads `GEMINI_API_KEY` for Google Generative AI; if not provided, uses a mock extractor
  - Persists requirements and AI output to MongoDB via `MONGODB_URI`

---

## Environment Setup

Create environment files (do not commit real secrets):

- `backend/.env`
```bash
# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=your_mongodb_connection_string

# Google Gemini (optional)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash-exp
```

- `frontend/.env`
```bash
# Backend API base URL
REACT_APP_API_URL=http://localhost:5000/api
```

Notes:
- Only expose non-sensitive vars in the frontend. Any `REACT_APP_` variable is embedded in the client bundle.
- Keep secrets (DB URIs, model API keys) in the backend `.env` or your hosting platform's environment settings.

---

## Run Locally

1) Install dependencies
```bash
cd backend && npm i
cd ../frontend && npm i
```

2) Start backend
```bash
cd backend
npm start
# health: http://localhost:5000/api/health
```

3) Start frontend
```bash
cd frontend
npm start
# open: http://localhost:3000
```

If `GEMINI_API_KEY` is not set, backend will use the built-in mock to return example structures for demo purposes.

---

## Deploy on Render (Suggested)

- Backend (Web Service)
  - Root: `backend/`
  - Start: `npm start`
  - Environment Variables:
    - `FRONTEND_URL=https://your-frontend.onrender.com`
    - `MONGODB_URI=...`
    - `GEMINI_API_KEY=...` (optional)
    - `GEMINI_MODEL=gemini-2.0-flash-exp` (optional)

- Frontend (Static Site)
  - Root: `frontend/`
  - Build Command: `npm i && npm run build`
  - Publish Directory: `build`
  - Environment Variables:
    - `REACT_APP_API_URL=https://your-backend.onrender.com/api`

Verification:
- `GET https://your-backend.onrender.com/api/health` returns OK
- The UI shows the correct API base URL
- `GET https://your-backend.onrender.com/api/apps/ai-status` confirms AI configuration (or mock)

---

## Backend API (Selected)
- `POST /api/apps/requirements` — submit requirement
  - body: `{ "userDescription": string }`
- `GET /api/apps/requirements/:id` — fetch a requirement with extracted data
- `GET /api/apps/requirements` — list recent requirements
- `GET /api/apps/ai-status` — AI configuration status
- `GET /api/health` — health check

---

## Alignment with Expected Capabilities
- **Code structure**: Clear separation of concerns (frontend, backend, services, routes, models)
- **AI integration**: Google Gemini via `GEMINI_API_KEY`; mock fallback ensures the demo runs without a key
- **Dynamic UI generation**: Forms and basic menus generated from extracted `entities`, `fields`, and `rolePermissions`
- **Usability**: Clean, simple navigation; loading/error states; consistent API responses
- **Deliverables**: Running app (local or hosted), public repository, and this README with setup steps

---

## Disclaimer
This repository is a demo to illustrate architecture and capability. Do not store or commit any secrets in the codebase. Use environment variables on your hosting provider for production.
