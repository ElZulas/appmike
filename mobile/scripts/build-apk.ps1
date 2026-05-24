# Compila APK release con URL de API pública (cualquier celular con internet).
# 1) Copia dart_defines\prod.json.example → dart_defines\prod.json
# 2) Edita API_BASE_URL con tu API desplegada (Render, Railway, etc.)
# 3) Ejecuta: .\scripts\build-apk.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

$prodFile = Join-Path $root "dart_defines\prod.json"
$example = Join-Path $root "dart_defines\prod.json.example"

if (-not (Test-Path $prodFile)) {
  if (-not (Test-Path $example)) {
    throw "Falta $example"
  }
  Copy-Item $example $prodFile
  Write-Host "Creado $prodFile — edítalo con tu URL pública antes de compilar." -ForegroundColor Yellow
  exit 1
}

$json = Get-Content $prodFile -Raw | ConvertFrom-Json
$url = $json.API_BASE_URL
if ([string]::IsNullOrWhiteSpace($url) -or $url -match 'TU-API|localhost|127\.0\.0\.1|10\.0\.2\.2') {
  throw "Edita $prodFile con la URL HTTPS pública de tu API (sin localhost ni IP de PC)."
}

$sdkRoot = "$env:LOCALAPPDATA\Android\Sdk"
if (Test-Path $sdkRoot) {
  $env:ANDROID_HOME = $sdkRoot
  $env:ANDROID_SDK_ROOT = $sdkRoot
  $env:Path = "$sdkRoot\platform-tools;$sdkRoot\cmdline-tools\latest\bin;$env:USERPROFILE\flutter\bin;" + $env:Path
}

Push-Location $root
flutter pub get
flutter build apk --release --dart-define-from-file=dart_defines/prod.json
Pop-Location

Write-Host ""
Write-Host "APK: $root\build\app\outputs\flutter-apk\app-release.apk" -ForegroundColor Green
Write-Host "API embebida: $url"
