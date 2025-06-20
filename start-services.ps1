# 英语单词学习应用 - PowerShell 启动脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    英语单词学习应用 - 服务启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 获取脚本所在目录
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "[1/3] 检查依赖..." -ForegroundColor Yellow

# 检查前端依赖
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "前端依赖缺失，正在安装..." -ForegroundColor Red
    Set-Location "frontend"
    npm install
    Set-Location ".."
}

# 检查后端依赖
if (!(Test-Path "backend\node_modules")) {
    Write-Host "后端依赖缺失，正在安装..." -ForegroundColor Red
    Set-Location "backend"
    npm install
    Set-Location ".."
}

Write-Host "[2/3] 启动后端服务器..." -ForegroundColor Yellow

# 启动后端服务器
$backendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location "$path\backend"
    node src/app.js
} -ArgumentList $scriptPath

Write-Host "后端服务器启动中..." -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host "[3/3] 启动前端服务器..." -ForegroundColor Yellow

# 启动前端服务器
$frontendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location "$path\frontend"
    npm run dev
} -ArgumentList $scriptPath

Write-Host "前端服务器启动中..." -ForegroundColor Green
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "           服务启动完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "前端地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host "后端地址: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

# 打开浏览器
Write-Host "正在打开浏览器..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "服务器状态监控:" -ForegroundColor Magenta
Write-Host "- 后端任务 ID: $($backendJob.Id)" -ForegroundColor Gray
Write-Host "- 前端任务 ID: $($frontendJob.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "要停止服务器，请运行: Stop-Job $($backendJob.Id), $($frontendJob.Id)" -ForegroundColor Red
Write-Host "或者直接关闭 PowerShell 窗口" -ForegroundColor Red
Write-Host ""

# 保持脚本运行
Write-Host "按 Ctrl+C 停止所有服务..." -ForegroundColor Yellow
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "正在停止服务..." -ForegroundColor Red
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Write-Host "服务已停止" -ForegroundColor Green
}
