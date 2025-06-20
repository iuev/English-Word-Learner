@echo off
echo Installing dependencies for English Word Learner...

echo.
echo Installing backend dependencies...
cd backend
call npm install --no-optional --prefer-offline
if %errorlevel% neq 0 (
    echo Backend installation failed, trying with --force flag...
    call npm install --force --no-optional
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install --no-optional --prefer-offline
if %errorlevel% neq 0 (
    echo Frontend installation failed, trying with --force flag...
    call npm install --force --no-optional
)

echo.
echo Installation complete!
echo.
echo To start the application:
echo 1. Backend: cd backend && npm run dev
echo 2. Frontend: cd frontend && npm run dev
cd ..
