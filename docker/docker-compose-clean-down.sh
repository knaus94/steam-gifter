#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g) 
docker-compose -f docker/docker-compose.yml down
docker volume rm steam-gift-postgresql --force
docker volume rm steam-gift-redis --force