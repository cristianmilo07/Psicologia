@echo off
echo ========================================
echo    Iniciando ARENYS CONTIGO 
echo ========================================
echo.

echo [1/2] Iniciando Backend en puerto 3000...
start cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo.
echo [2/2] Iniciando Frontend en puerto 4200...
start cmd /k "cd frontend && ng serve"

echo.
echo ========================================
echo    Servidores iniciados
echo ========================================
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:4200
echo.
pause

