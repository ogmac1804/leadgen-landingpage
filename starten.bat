@echo off
chcp 65001 >nul 2>&1
title LeadGen Landingpage

echo ===========================================================
echo   LeadGen Landingpage - Webserver
echo ===========================================================
echo.
echo   Seite wird gestartet auf: http://localhost:3000
echo   Zum Beenden: Dieses Fenster schliessen oder STRG+C
echo.
echo ===========================================================

start http://localhost:3000

cd /d "%~dp0"
python -m http.server 3000
