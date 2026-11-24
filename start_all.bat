@echo off
title FormFlow - Launch All Services
echo ===================================================
echo   Starting FormFlow Assistant Services
echo ===================================================
echo.

echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "FormFlow Backend (FastAPI)" cmd /k "cd /d %~dp0backend && venv\Scripts\python.exe run_backend.py"

echo [2/2] Launching Frontend (Vite) on http://localhost:5173 ...
start "FormFlow Frontend (React Vite)" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo.
echo ===================================================
echo   Both services are starting!
echo   Frontend: http://localhost:5173/
echo   Backend:  http://localhost:8000/docs
echo ===================================================
timeout /t 3 >nul
