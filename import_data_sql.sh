#!/bin/bash

# Generate SQL statements from the JSON data
echo "Generating SQL statements from JSON data..."
python apps/api/src/scripts/generate_sql.py examples/data-sample-01.json import_data.sql

# Check if the SQL file was generated successfully
if [ ! -f "import_data.sql" ]; then
    echo "Failed to generate SQL statements."
    exit 1
fi

echo "SQL statements generated successfully and saved to import_data.sql"
echo ""
echo "To import the data into PostgreSQL, run the following commands:"
echo "1. Install PostgreSQL if not already installed"
echo "2. Create the database: psql -U postgres -c 'CREATE DATABASE coloragent;'"
echo "3. Execute the SQL statements: psql -U postgres -d coloragent -f import_data.sql"
