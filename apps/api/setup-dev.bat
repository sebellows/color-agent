@echo off
echo Checking for virtual environment...
if not exist .venv (
    echo Virtual environment not found. Please run setup.bat first.
    exit /b 1
)

echo Activating virtual environment...
call .venv\Scripts\activate

echo Installing development dependencies using uv...
uv sync requirements.txt requirements-dev.txt

echo Development setup complete! Development dependencies installed.
