Write-Host "Iniciando PitayaCode Academy en modo local..." -ForegroundColor Green

# Iniciar Base de Datos
Write-Host "Levantando Base de Datos (Docker)..." -ForegroundColor Cyan
Invoke-Expression "docker-compose up -d db"

# Esperar a que la base de datos esté lista (ajustar tiempo si es necesario)
Write-Host "Esperando 10 segundos para que la BD inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Iniciar Backend
Write-Host "Arrancando API (Backend) en puerto 3004..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd api; npm run start:dev"

# Esperar un momento para que el backend empiece a inicializar
Start-Sleep -Seconds 5

# Iniciar Frontend
Write-Host "Arrancando Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "¡Todo listo! Las terminales se han abierto." -ForegroundColor Green
