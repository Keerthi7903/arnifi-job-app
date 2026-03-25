# Arnifi Jobs — Full Stack Job Application

## Live Links
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.vercel.app

## Stack
- **Frontend**: React + Vite, Redux Toolkit, React Router
- **Backend**: Node.js + Express, PostgreSQL, JWT

## Setup Locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

## Auth Rules
- `@arnifi.com` email → Admin (dashboard + CRUD jobs)
- Any other email → User (browse + apply to jobs)