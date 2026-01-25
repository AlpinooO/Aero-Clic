# Script de démarrage pour Aero Clic
Write-Host "🚀 Démarrage de Aero Clic..." -ForegroundColor Cyan

# Arrêter les conteneurs existants
Write-Host "📦 Arrêt des conteneurs existants..." -ForegroundColor Yellow
docker-compose down 2>$null

# Reconstruire et démarrer
Write-Host "🔨 Reconstruction et démarrage des conteneurs..." -ForegroundColor Green
docker-compose up -d --build

# Attendre que tout soit prêt
Write-Host "⏳ Attente du démarrage complet..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Vérifier le statut
Write-Host "`n📊 Statut des conteneurs:" -ForegroundColor Cyan
docker-compose ps

Write-Host "`n✅ Aero Clic est prêt!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔑 API Gateway: http://localhost:5000" -ForegroundColor Cyan
Write-Host "💼 Business API: http://localhost:5001" -ForegroundColor Cyan
Write-Host "`nPour voir les logs: docker-compose logs -f" -ForegroundColor Yellow
