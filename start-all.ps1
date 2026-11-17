# DIGITAL MARKET - PowerShell Launcher Script
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "          DIGITAL MARKET - Starting Full Stack Servers               " -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "[1/3] Starting Backend Server (Express + Prisma, Port 5000)..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$root\backend`" && npm.cmd run dev" -WindowStyle Normal

Write-Host "[2/3] Starting Frontend Server (Vite + React, Port 5173)..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$root\frontend`" && npm.cmd run dev" -WindowStyle Normal

Write-Host "[3/3] Waiting for servers to initialize..." -ForegroundColor DarkGray
Start-Sleep -Seconds 3

Write-Host "Opening DIGITAL MARKET in default browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173/"

Write-Host "`nAll servers running successfully!" -ForegroundColor Green
Write-Host "Customer Portal: http://localhost:5173/" -ForegroundColor White
Write-Host "Admin Portal:    http://localhost:5173/admin/login" -ForegroundColor White
Write-Host "Support Contact: +91 96506 24535 (WhatsApp: 919650624535)`n" -ForegroundColor Yellow
