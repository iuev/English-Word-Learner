@echo off
echo 启动英语单词学习应用...
echo.

echo 启动后端服务器...
start "后端" cmd /k "cd /d %~dp0\backend && node src/app.js"

timeout /t 3 /nobreak >nul

echo 启动前端服务器...
start "前端" cmd /k "cd /d %~dp0\frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo 服务启动完成！
echo 前端: http://localhost:3000
echo 后端: http://localhost:5000
echo.

start http://localhost:3000

pause
