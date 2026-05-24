# Mata procesos Node del proyecto (libera RAM antes de iniciar dev)
# Uso: powershell -ExecutionPolicy Bypass -File scripts/kill-dev.ps1
$ports = 3000, 4000
foreach ($p in $ports) {
  Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object {
      Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
      Write-Host "Puerto $p liberado (PID $($_.OwningProcess))"
    }
}

$before = @(Get-Process node -ErrorAction SilentlyContinue).Count
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
$after = @(Get-Process node -ErrorAction SilentlyContinue).Count
Write-Host "Procesos Node: $before -> $after (quedan otros si Cursor/VS Code los usa)"
