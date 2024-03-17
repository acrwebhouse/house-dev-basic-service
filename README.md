# house-dev-basic-service

build docker
docker build . -t acrwebdev/house-dev-basic-service

docker push
docker push acrwebdev/house-dev-basic-service

docker pull
docker pull acrwebdev/house-dev-basic-service:latest

run docker
docker run -p 24000:24000 --env SERVER_IP=35.234.42.100 --env SERVER_PORT=24000 --env SWAGGER_IP=35.234.42.100 --env DB_URI="" --restart=always --name=house-dev-basic-service -d acrwebdev/house-dev-basic-service
