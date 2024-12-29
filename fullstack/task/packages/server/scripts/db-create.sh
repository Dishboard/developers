#!/bin/bash

# 1. Remove old containers if they exist
echo "Removing old docker containers..."
(docker stop dishboard-dev-task-db pgadmin || :) && (docker rm dishboard-dev-task-db pgadmin || :)

# 2. Create Docker network if it doesn't exist
echo "Creating Docker network..."
docker network create pg-network || echo "Network pg-network already exists."

# 3. Start PostgreSQL container
echo "Starting PostgreSQL container..."
docker run \
    --name dishboard-dev-task-db \
    -e POSTGRES_PASSWORD=postgres \
    -e PGPASSWORD=postgres \
    -p 5430:5432 \
    --network pg-network \
    -d postgres

# 4. Start pgAdmin container
echo "Starting pgAdmin container..."
docker run \
    --name pgadmin \
    -e PGADMIN_DEFAULT_EMAIL=pgadminuser@gmail.com \
    -e PGADMIN_DEFAULT_PASSWORD=Database123! \
    -p 8080:80 \
    --network pg-network \
    -d dpage/pgadmin4:latest

# 5. Wait for the database to start
echo "Waiting for the database to start..."
sleep 5

# 6. Create the database
echo "Creating the database..."
docker exec -i dishboard-dev-task-db psql -U postgres -c "CREATE DATABASE dev;"

# 7. Provide instructions
echo "PostgreSQL and pgAdmin setup complete. pgAdmin is available at http://localhost:8080/."
