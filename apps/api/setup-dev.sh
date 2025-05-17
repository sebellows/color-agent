#!/bin/bash
set -e

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Virtual environment not found. Please run setup.sh first."
    exit 1
fi

# Activate the virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install development dependencies using uv
echo "Installing development dependencies using uv..."
uv pip sync requirements.txt requirements-dev.txt

echo "Development setup complete! Development dependencies installed."
