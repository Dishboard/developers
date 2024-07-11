#!/bin/bash

# Define the container name and volume name
CONTAINER_NAME="dishboard-dev-task-db"
VOLUME_NAME="dishboard-dev-task-db-data"

# Build the Docker image
echo "Building the Docker image..."
docker build -t custom-postgres-pg_cron .

echo "Removing old docker container..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

echo "Removing old volume..."
docker volume rm $VOLUME_NAME || true

echo "Creating a named volume for PostgreSQL data..."
docker volume create $VOLUME_NAME

echo "Creating a new instance..."
docker run \
    --name $CONTAINER_NAME \
    -e POSTGRES_PASSWORD=postgres \
    -e PGPASSWORD=postgres \
    -p 5430:5432 \
    -v $VOLUME_NAME:/var/lib/postgresql/data \
    -d custom-postgres-pg_cron

echo "Waiting for the database to start..."
MAX_RETRIES=10
retries=0
step=2
until docker exec $CONTAINER_NAME pg_isready -U postgres; do
    sleep $step
    retries=$((retries + $step))
    if [ $retries -gt $MAX_RETRIES ]; then
        echo "The database is taking too long to start. Exiting..."
        exit 1
    fi
done

echo "Dropping the existing database..."
docker exec -i $CONTAINER_NAME psql -U postgres -c "DROP DATABASE IF EXISTS dev;"

echo "Creating the database if it doesn't exist..."
docker exec -i $CONTAINER_NAME psql -U postgres -c "CREATE DATABASE dev;"

echo "Setting cron.database_name configuration..."
docker exec -i $CONTAINER_NAME psql -U postgres -c "ALTER SYSTEM SET cron.database_name = 'dev';"

echo "Reloading configuration..."
docker exec -i $CONTAINER_NAME psql -U postgres -c "SELECT pg_reload_conf();"

echo "Creating pg_cron extension..."
docker exec -i $CONTAINER_NAME psql -U postgres -d dev -c "CREATE EXTENSION IF NOT EXISTS pg_cron;"
