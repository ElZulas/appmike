# Copia el APK release a web/public/downloads para descarga desde la landing.
# Ejecutar tras: flutter build apk --release --dart-define-from-file=dart_defines/prod.json

$ErrorActionPreference = "Stop"
$mobileRoot = Split-Path $PSScriptRoot -Parent
$repoRoot = Split-Path $mobileRoot -Parent
$apk = Join-Path $mobileRoot "build\app\outputs\flutter-apk\app-release.apk"
$destDir = Join-Path $repoRoot "web\public\downloads"
$dest = Join-Path $destDir "super-socio.apk"

if (-not (Test-Path $apk)) {
  throw "No existe el APK. Compila primero: cd mobile; .\scripts\build-apk.ps1"
}

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item $apk $dest -Force
Write-Host "APK publicado: $dest" -ForegroundColor Green
Write-Host "Commit web/public/downloads/super-socio.apk y redeploy en Vercel."
