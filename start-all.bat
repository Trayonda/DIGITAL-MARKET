@echo off
TITLE DIGITAL MARKET - Full Stack E-Commerce Platform
color 0A

echo =====================================================================
echo           DIGITAL MARKET - Starting Full Stack Servers
echo =====================================================================
echo.
echo [1/3] Starting Express and Prisma Backend Server on port 5000...
start "Digital Market - Backend Server" cmd /k "cd /d "%~dp0backend" && npm.cmd run dev"

echo [2/3] Starting Vite and React Frontend Server on port 5173...
start "Digital Market - Frontend Server" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening Digital Market in your default web browser...
start http://localhost:5173/

echo.
echo =====================================================================
echo  Digital Market is now LIVE!
echo  - Customer Website:  http://localhost:5173/
echo  - Admin Dashboard:   http://localhost:5173/admin/login
echo  - Backend API:       http://localhost:5000/api/store-settings
echo  - Support Number:    +91 96506 24535 (WhatsApp: 919650624535)
echo =====================================================================
echo.
pause
