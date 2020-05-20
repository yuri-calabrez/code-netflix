## Rodar a aplicação

#### Rodar o RabbitMQ

Clone o projeto de configuração Docker do RabbitMQ neste [link](https://github.com/yuri-calabrez/rabbitmq-micro-catalog). Rode ```docker-compose up```.

#### Crie os containers com Docker

```bash
$ docker-compose up -d
```

#### Rodar seeds

```bash
$ docker-compose exec app bash
$ cd backend
$ php artisan db:seed
```

#### Rodar aplicação front-end

```bash
$ cd ../frontend
$ npm start
```

#### Accesse no browser

```
http://localhost:3000
```