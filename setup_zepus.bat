@echo off
echo -------------------------------------
echo   Starting Zepus Portable Installer
echo -------------------------------------

REM Create virtual environment
python -m venv venv

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Upgrade pip
python -m pip install --upgrade pip

REM Install core Flask dependencies
pip install flask flask_sqlalchemy flask_bcrypt flask_socketio eventlet requests

REM Install WeasyPrint + dependencies
pip install weasyprint

REM Install Windows GTK + Cairo + Pango pre-built
pip install tinycss2 cffi cairocffi pycparser

REM Download GTK Windows binaries (automatically resolved via weasyprint on latest versions)

echo -------------------------------------
echo  Installation Complete!
echo -------------------------------------

pause
