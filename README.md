# Sidecar Pattern Microservices

This project demonstrates the **Sidecar Pattern** using Node.js and Docker Compose.  
The goal is to separate application logic from cross-cutting concerns like logging and metrics.

Instead of embedding logging and monitoring logic inside the services, each service has its own **logging sidecar** and **metrics sidecar** running alongside it.

---

## Architecture Overview

There are three main application services:

- user-service
- product-service
- order-service

Each service:

- Writes structured JSON logs to `/var/log/app/app.log`
- Exposes a `/health` endpoint
- Exposes a Prometheus-compatible `/metrics` endpoint

Each service has:

- A logging sidecar → Tails logs, enriches them, and forwards them
- A metrics sidecar → Scrapes metrics, enriches them, and re-exposes them

There is also:

- A central `log-aggregator` service to receive logs from sidecars

---

## How to Run

Make sure you have:

- Docker
- Docker Compose

From the root folder:

```bash
docker compose up --build
````

Wait until all containers are healthy.

---

## Test the Services

### Application Endpoints

* [http://localhost:3001/users](http://localhost:3001/users)
* [http://localhost:3002/products](http://localhost:3002/products)
* [http://localhost:3003/orders](http://localhost:3003/orders)

### Aggregated Logs

* [http://localhost:8080/logs](http://localhost:8080/logs)

You should see logs enriched with:

* service_name
* environment

### Metrics Endpoints

* [http://localhost:9101/metrics](http://localhost:9101/metrics)
* [http://localhost:9102/metrics](http://localhost:9102/metrics)
* [http://localhost:9103/metrics](http://localhost:9103/metrics)

Each metric includes:

* service_name label
* environment label

---

## What This Project Demonstrates

* Sidecar architecture pattern
* Decoupled observability
* Structured logging
* Prometheus metrics format
* Docker Compose multi-service setup
* Shared volumes between containers
* Healthchecks and service dependencies

---

## Tech Stack

* Node.js (Express)
* Winston (Logging)
* prom-client (Metrics)
* Docker & Docker Compose

---

## Environment Variables

See `.env.example` for configuration details.

---

## Status

All services, logging sidecars, and metrics sidecars are fully functional and communicate correctly using Docker networking and shared volumes.
