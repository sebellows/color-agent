# Data Import Process

This document describes the process for importing data from JSON files into the ColorAgent database.

## Prerequisites

-   PostgreSQL installed and running
-   Python 3.x installed

## Import Process

There are two main approaches to import the data:

### 1. Using the SQL Generation Script

The `import_data_sql.sh` script generates SQL statements from the JSON data that can be executed to import the data into the database.

```bash
# Generate SQL statements
./import_data_sql.sh
```

This will create an `import_data.sql` file with all the necessary SQL statements to import the data.

To import the data into PostgreSQL:

1. Install PostgreSQL if not already installed
2. Create the database: `psql -U postgres -c 'CREATE DATABASE coloragent;'`
3. Execute the SQL statements: `psql -U postgres -d coloragent -f import_data.sql`

### 2. Using Docker (if PostgreSQL is not installed locally)

If you have Docker installed, you can use the Docker Compose setup to run the database and import the data:

1. Update the `docker-compose.yml` file to ensure it's compatible with your Docker version
2. Run the database container: `docker-compose up -d postgres`
3. Wait for the database to be ready
4. Run the import script: `docker-compose exec postgres psql -U postgres -d coloragent -f /path/to/import_data.sql`

## Data Structure

The JSON data follows this structure:

-   Vendors: Companies that produce paint products
    -   Product Lines: Collections of products under a specific brand or category
        -   Products: Individual paint colors
            -   Variants: Different formulations or packaging of the same color

## Generated SQL Structure

The generated SQL file includes:

1. Vendor insertions
2. Product line insertions (linked to vendors)
3. Product insertions (linked to product lines)
4. Product swatch insertions (linked to products)
5. Product variant insertions (linked to products)

All insertions use `ON CONFLICT` clauses to update existing records if they already exist, making the import process idempotent.

## Troubleshooting

-   If you encounter permission issues with PostgreSQL, make sure you're using the correct user credentials
-   If the SQL file has syntax errors, check the JSON data for any unusual characters or formats
-   For Docker-related issues, check the Docker logs: `docker-compose logs postgres`
