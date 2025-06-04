#!/bin/bash

# Copy the import_data_modified.py script to the correct location
cp apps/api/src/scripts/import_data_modified.py apps/api/src/scripts/import_data.py

# Start the Docker containers in detached mode
docker-compose up -d postgres

# Wait for the database to be ready
echo "Waiting for the database to be ready..."
sleep 10

# Build and start the API container
docker-compose up -d api

# Wait for the API container to be ready
echo "Waiting for the API container to be ready..."
sleep 10

# Run the import_data.py script inside the API container
echo "Running the import script..."
docker-compose exec api python -m api.scripts.import_data_modified examples/data-sample-01.json

echo "Data import completed!"
