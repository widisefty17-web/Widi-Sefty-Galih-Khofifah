@echo off
title Server Portofolio Galih - localhost:8080
echo ===================================================
echo   Memulai Server Portofolio Galih (SMK RPL)
echo   Alamat: http://localhost:8080
echo ===================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
