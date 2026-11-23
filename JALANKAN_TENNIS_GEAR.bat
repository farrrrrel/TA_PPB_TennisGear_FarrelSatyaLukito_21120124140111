@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js belum terpasang. Install Node.js 20.19 atau lebih baru dulu.
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo [1/2] Menginstall dependensi Tennis Gear...
  call npm install
  if errorlevel 1 (
    echo Install gagal. Pastikan internet aktif, lalu coba npm install manual.
    pause
    exit /b 1
  )
)
echo [2/2] Menjalankan backend Express dan frontend PWA...
echo Buka http://localhost:5173 di browser.
call npm run dev
pause
