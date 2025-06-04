@echo off
echo Creating Python 3.13 virtual environment using uv...
uv venv -p python3.13 .venv

echo Activating virtual environment...
call .venv\Scripts\activate

echo Installing dependencies using uv...
uv sync requirements.txt

echo Setup complete! Virtual environment created and dependencies installed.
echo To activate the virtual environment, run: .venv\Scripts\activate
