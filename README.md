# node-test


cp .env.example .env

docker-compose up -d

psql -U postgres -h localhost -c "CREATE DATABASE node_test;"

docker compose exec web node-test

npm install 

npx sequelize-cli db:migrate

npx sequelize-cli db:seed:all

npm start
