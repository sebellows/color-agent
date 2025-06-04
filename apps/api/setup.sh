#!/bin/bash
set -e

# Create a Python 3.13 virtual environment using uv
echo "Creating Python 3.13 virtual environment using uv..."
uv venv -p python3.13 .venv

# Activate the virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install dependencies using uv
echo "Installing dependencies using uv..."
uv sync requirements.txt

echo "Setup complete! Virtual environment created and dependencies installed."
echo "To activate the virtual environment, run: source .venv/bin/activate"
