# Rate Limiter
Basic auth with rate limiting feature

## Requirements

- Docker

## Install

- `docker compose up --build`

## Benchmarking
- use [Apache Benchmark](https://httpd.apache.org/docs/2.4/programs/ab.html) to send test concurrent requests / sec
`ab -c 100 -t 5 "http://localhost:3000/public` feel free to play with command

- use `outvio.postman_collection.json` for PostMan collection

## TODO

- [x] keep concurrency in mind
- [x] basic auth
  - `/private` endpoint will use middleware to verify token from header
  - `/public` accessable without any tokens
- [x] implement rate limit
  - for public endpoint to rate limit by ip to 100 req/hour (env_var)
  - for private endpoint to rate limit by token to 200 req/hour (env_var)
- [x] in the response with 429 status code and show an error message about current limit for that user account, and display when (time) the user can make the next request
- [x] cache using redis to enhance performance
- [x] BONUS custom limit rate limiter
