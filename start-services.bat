@echo off
chcp 65001 >nul
echo ========================================
echo    英语单词学习应用 - 服务启动脚本
echo ========================================
echo.

echo [1/3] 检查依赖...
cd /d "%~dp0"

if not exist "frontend\node_modules" (
    echo 前端依赖缺失，正在安装...
    cd /d "%~dp0\frontend"
    call npm install
    cd /d "%~dp0"
)

if not exist "backend\node_modules" (
    echo 后端依赖缺失，正在安装...
    cd /d "%~dp0\backend"
    call npm install
    cd /d "%~dp0"
)

echo [2/3] 启动后端服务器...
start "后端服务器" cmd /k "cd /d %~dp0\backend && echo 启动后端服务器... && node src/app.js"

echo 等待后端服务器启动...
timeout /t 3 /nobreak >nul

echo [3/3] 启动前端服务器...
start "前端服务器" cmd /k "cd /d %~dp0\frontend && echo 启动前端服务器... && npm run dev"

echo.
echo ========================================
echo           服务启动完成！
echo ========================================
echo.
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:5000
echo.
echo 按任意键打开浏览器...
pause >nul

start http://localhost:3000

echo.
echo 提示: 关闭此窗口不会停止服务器
echo 要停止服务器，请关闭对应的命令行窗口
echo.
pause
