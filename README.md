# Kafka + Elasticsearch E-commerce Microservices

A Node.js and TypeScript microservices backend for an e-commerce platform, built step by step with a layered, test-first design. Services will talk over Kafka, and product search will be served from Elasticsearch.

> **Status:** work in progress. The **Catalog service** is implemented and tested (REST API, PostgreSQL via Prisma, validation, 26 unit and route tests). The **Order service** is scaffolded. Kafka events and Elasticsearch sync are planned next and are marked in the code where they will plug in.

## Architecture

```
Client ──► Catalog Service (Express 5, TypeScript)
              │  routes ─► service ─► repository (interface)
              │                         ├─ CatalogRepository (Prisma + PostgreSQL)
              │                         └─ MockCatalogRepository (tests)
              │
              ├─ (planned) publish product events ─► Kafka ─► Order Service
              └─ (planned) index products ─► Elasticsearch ─► search / listing
```

- **Layered design:** HTTP routes, a service layer with business rules, and a repository interface, so the database can be swapped or mocked.
- **Dependency injection:** the service receives its repository through the constructor, which is how the tests run without a database.
- **Validation:** request DTOs with `class-validator` and `class-transformer`.

## Tech stack

| Layer | Tools |
| --- | --- |
| Runtime | Node.js, TypeScript, Express 5 |
| Database | PostgreSQL 14, Prisma 7 (`@prisma/adapter-pg`) |
| Validation | class-validator, class-transformer |
| Testing | Jest, ts-jest, Supertest, Faker, Rosie factories |
| Infra | Docker Compose |
| Planned | Apache Kafka, Elasticsearch |

## Catalog API

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/products` | Create a product (`name`, `description`, `price` ≥ 1, `stock` ≥ 0) |
| `GET` | `/products?limit=10&offset=0` | List products with pagination |
| `GET` | `/products/:id` | Get one product |
| `PATCH` | `/products/:id` | Update a product |
| `DELETE` | `/products/:id` | Delete a product |

Invalid IDs and pagination values return `400`, missing products return `404`. Sample requests are in `catalog_service/request.http`.

## Run locally

```bash
# 1. Start PostgreSQL
cd db && docker compose up -d

# 2. Configure and start the catalog service
cd ../catalog_service
cp .env.example .env
yarn install
npx prisma migrate deploy
yarn dev            # http://localhost:8000

# 3. Run the tests
yarn test
```

## Project structure

```
catalog_service/
  prisma/              schema and migrations
  src/
    api/               Express routes + route tests
    services/          business logic + service tests
    repository/        Prisma repository and in-memory mock
    interface/         repository contract
    dto/               request validation classes
    utils/             validator helper, test fixtures
order_service/         scaffold (next up)
db/                    docker-compose for PostgreSQL
```

## Roadmap

- [x] Catalog CRUD with validation and pagination
- [x] PostgreSQL persistence with Prisma migrations
- [x] Unit and route tests with a mock repository
- [ ] Order service
- [ ] Kafka producer and consumers for product and order events
- [ ] Elasticsearch indexing and full-text product search
- [ ] Dockerize every service

## Author

**Anurag Kumar** · [anurag.engineer](https://anurag.engineer) · [GitHub](https://github.com/log1-codes)
