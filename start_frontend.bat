@echo off
title FormFlow Frontend
cd /d %~dp0frontend
echo Starting FormFlow React + Vite Frontend on http://localhost:5173 ...
npm.cmd run dev
pause
