@echo off
title FormFlow Backend Orchestrator
cd /d %~dp0backend
echo Starting FormFlow FastAPI Backend Orchestrator on http://localhost:8000 ...
venv\Scripts\python.exe run_backend.py
pause
