#!/bin/bash

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install it first."
    exit 1
fi

# Create the database if it doesn't exist
echo "Creating database if it doesn't exist..."
psql -U postgres -c "CREATE DATABASE coloragent;" || true

# Copy the import_data_modified.py script to the correct location
cp apps/api/src/api/scripts/import_data_modified.py apps/api/src/api/scripts/import_data.py

# Set the database URL environment variable
export DB_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/coloragent"

# Activate the virtual environment if it exists
if [ -d "apps/api/.venv" ]; then
    source apps/api/.venv/bin/activate
fi

# Run the create_tables.py script
echo "Creating tables..."
cd apps/api && python -m api.scripts.create_tables

# Run the import_data.py script
echo "Importing data..."
cd apps/api && python -m api.scripts.import_data ../examples/data-sample-01.json

echo "Data import completed!"
