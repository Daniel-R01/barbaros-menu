@echo off
setlocal
set ROOT=C:\Users\danie\repositorios\Menu
cd /d "%ROOT%"

REM Inicia servidor en ventana separada y lo deja corriendo
start "Barbaros Server" cmd /k "cd /d %ROOT% && npm start"

REM Espera breve para que el puerto 3000 levante
timeout /t 3 /nobreak >nul

REM Abre menu publico y panel admin desde HTTP (no file://)
start "" http://127.0.0.1:3000/
start "" http://127.0.0.1:3000/admin.html
