## Concept Canvas

An AI-powered app prototype generator that transforms natural language descriptions into structured requirements and interactive mock UIs. Users describe their app idea, and the system generates a complete interface with role-based access control, dynamic forms, and navigation.

It's now depolyed by render: https://ai-app-builder-frontend.onrender.com/

<img width="2139" height="1390" alt="image" src="https://github.com/user-attachments/assets/b6de45cd-6060-4da3-b9c8-cb22919eaffa" />


- **Tech Stack**: React, Node.js, Express, MongoDB, Google Gemini AI
- **Deployment**: Local development or cloud hosting (Render recommended)

---

## Features
<img width="1433" height="1269" alt="image" src="https://github.com/user-attachments/assets/307f9b71-12cc-442f-af95-a1eda0a2c43e" />
<img width="1936" height="1281" alt="image" src="https://github.com/user-attachments/assets/b543a74b-7023-4d83-a3d3-63390435f030" />



### AI-Powered Requirement Analysis
- Natural language processing to extract structured app requirements
- Automatic entity, role, and permission identification
- Fallback to mock data when AI services are unavailable

### Dynamic UI Generation
- Role-based interface generation with appropriate permissions
- Interactive forms with multiple field types (text, email, number, date, select, textarea)
- Responsive design for desktop and mobile devices
- Real-time form validation and submission

### Permission Management
- Granular role-based access control (canCreate, canView, canEdit)
- Automatic permission validation and fallback mechanisms
- Visual permission overview for each role

---

## Architecture

### Frontend (`/frontend`)
- React application with modern hooks and state management
- Tailwind CSS for responsive styling
- Component-based architecture with reusable UI elements
- Real-time polling for AI processing status

### Backend (`/backend`)
- Express.js REST API with structured error handling
- MongoDB integration for data persistence
- Google Gemini AI integration with structured output
- Comprehensive validation and fallback mechanisms

---

## Environment Configuration

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

## Local Development

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

## Deployment

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

## API Reference
- `POST /api/apps/requirements` — submit requirement
  - body: `{ "userDescription": string }`
- `GET /api/apps/requirements/:id` — fetch a requirement with extracted data
- `GET /api/apps/requirements` — list recent requirements
- `GET /api/apps/ai-status` — AI configuration status
- `GET /api/health` — health check

---

## Security & Best Practices

- Environment variables for all sensitive configuration
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Error handling with fallback mechanisms
- No hardcoded secrets or API keys

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
