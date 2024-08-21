#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker network create -d bridge docker_steam-gift-network
docker volume create --name=steam-gift-postgresql --label=steam-gift-postgresql
docker volume create --name=steam-gift-redis --label=steam-gift-redis
docker-compose -f docker/docker-compose-database.yml up -d
npm run wait-for-it -- localhost:$POSTGRES_PORT --timeout=350
npm run database:recreate:prod && npm run database:migrate:prod && npm run database:seed:prod
docker-compose -f docker/docker-compose.yml up -d
echo Wait server...
npm run wait-for-it -- localhost:8080 --timeout=350
