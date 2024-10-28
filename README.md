# node-test


```cp .env.example .env```

```docker-compose up -d```



```docker compose exec db bash```

```psql -U postgres -h localhost -c "CREATE DATABASE node_test;"```


```docker compose exec node bash```

```npx sequelize-cli db:migrate```

```npx sequelize-cli db:seed:all```

