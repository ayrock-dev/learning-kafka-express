## To Start Up
Start the whole stack with `docker-compose up`.

* Kafka running at infrastructure.test:9092
* Node Express backend is started at localhost:3000

## Trying the demo

To enable the Node Express backend, un-comment the `web` service in `docker-compose.yml`. Then restart by stopping the dockers and again using `docker-compose up`.

Endpoints:
GET `localhost:3000/` - "Hello World" health check response
GET `localhost:3000/topic1` - see all messages on the `topic1` topic
POST `localhost:3000/topic1` with a raw plaintext body - add a message to `topic1` topic

Notes:
Consumer never commits offset. Web app is dependent on Kafka being up before hitting the `/topic1` endpoints.

## Troubleshooting
add `127.0.0.1    infrastructure.test` entry to your host file
