@echo off
echo Iniciando PitayaCode Academy...
start "PitayaCode API" cmd /k "cd api && npm run start:dev"
timeout /t 5
start "PitayaCode Frontend" cmd /k "cd frontend && npm run dev"
echo ¡Listo!
