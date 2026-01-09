# PowerShell Script to Switch Docker Environments
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev','staging','prod')]
    [string]$Environment
)

$ErrorActionPreference = "Stop"

Write-Host "Switching to $Environment environment..." -ForegroundColor Cyan

# Check if environment file exists
$envFile = ".env.$Environment"
if (-not (Test-Path $envFile)) {
    Write-Host "Error: Environment file $envFile not found!" -ForegroundColor Red
    exit 1
}

# Stop existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Copy environment file
Write-Host "Loading $Environment configuration..." -ForegroundColor Yellow
Copy-Item -Path $envFile -Destination ".env" -Force

# Start containers with new environment
Write-Host "Starting containers in $Environment mode..." -ForegroundColor Green
docker-compose up -d

Write-Host "`nEnvironment switched to: $Environment" -ForegroundColor Green
Write-Host "Run 'docker-compose logs -f' to view logs" -ForegroundColor Cyan
