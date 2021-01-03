# Сайт для наложения лица на фото из Google Drive

### Технологии

* Docker
* Java
* Spring Cloud
* Zuul gateway
* React
* PostgreSQL

### Архитектура приложения
![Alt-текст](https://github.com/OlegZdanevich/msqrd_docker/blob/main/images/arch1.jpg?raw=true "Архитектура приложения")


### Команды для запуска

Перечень сервисов

* База Данных
    * pgmaster
    * pgslave1
    * pgslave2
    * pgslave3
    * pgslave4
    * pgpool
* BackEnd
    * msqrd-eureka-server
    * msqrd-edge-server
    * db_service_81
    * db_service_82
    * auth_service_41
    * auth_service_42
    * rabbitmq
    * user_service_31
    * user_service_32
    * mask_service_1
    * mask_service_2
* FrontEnd
    * client
    

Запуск сервисов базы данных :`docker-compose up pgmaster pgslave1 pgslave2 pgslave3 pgslave4 pgpool`

Запуск сервисов BackEnd :`docker-compose up msqrd-eureka-server msqrd-edge-server db_service_81 db_service_82 auth_service_41 auth_service_42 rabbitmq user_service_31 user_service_32 mask_service_1 mask_service_2`

Запуск сервисов FrontEnd:`docker-compose up client`

Запуск всех сервисов :`docker-compose up`

### Инстуркция по запуску
1) Сначала запускаем все сервисы коммандой `docker-compose up`
2) В браузере вводим http://localhost:3000
3) Пользуемся

### Расширения

Пример создания новой ноды

* `docker build -t user_service_33:0.1 -f ./backend/user_service/Dockerfile `
* `docker run --name user_service_33 -p 8033:8033 -e SPRING_PROFILES_ACTIVE=prod -e SERVER_PORT=8033 --network=msqrd_docker_modules_loader -d user_service_33:0.1`
* `docker network connect  msqrd_docker_backEnd user_service_33`