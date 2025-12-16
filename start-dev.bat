@echo off
echo Starting CredoCarbon Development Environment...

:: Start Backend (in new window)
start "CredoCarbon Backend" cmd /k "echo Starting FastAPI... & call venv\Scripts\activate & uvicorn apps.api.main:app --reload --port 8000"

:: Start Frontend (in new window)
start "CredoCarbon Frontend" cmd /k "echo Starting Next.js... & cd apps\web & npm run dev"

echo Services started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
