# 检查服务器状态
Write-Host "=== 检查 Node 进程 ===" -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "找到 $($nodeProcesses.Count) 个 Node 进程" -ForegroundColor Green
    $nodeProcesses | Format-Table Id, ProcessName, StartTime
} else {
    Write-Host "没有运行中的 Node 进程" -ForegroundColor Yellow
}

Write-Host "`n=== 检查端口 3000 ===" -ForegroundColor Cyan
$portCheck = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($portCheck) {
    Write-Host "端口 3000 正在监听" -ForegroundColor Green
} else {
    Write-Host "端口 3000 未监听" -ForegroundColor Yellow
}

Write-Host "`n=== 检查 .next 目录 ===" -ForegroundColor Cyan
if (Test-Path .next) {
    Write-Host ".next 目录存在" -ForegroundColor Green
    $nextSize = (Get-ChildItem -Path .next -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "大小: $([math]::Round($nextSize, 2)) MB"
} else {
    Write-Host ".next 目录不存在" -ForegroundColor Yellow
}

Write-Host "`n=== 尝试启动服务器（5秒后检查）===" -ForegroundColor Cyan
$env:TURBOPACK = "0"
$job = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    $env:TURBOPACK = "0"
    npm run dev 2>&1
}

Start-Sleep -Seconds 5

Write-Host "`n=== 检查启动后的状态 ===" -ForegroundColor Cyan
$nodeProcessesAfter = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcessesAfter) {
    Write-Host "服务器已启动！" -ForegroundColor Green
    Write-Host "进程数: $($nodeProcessesAfter.Count)"
} else {
    Write-Host "服务器未启动" -ForegroundColor Red
    Write-Host "`n查看输出:" -ForegroundColor Yellow
    Receive-Job $job
}

Stop-Job $job -ErrorAction SilentlyContinue
Remove-Job $job -ErrorAction SilentlyContinue
