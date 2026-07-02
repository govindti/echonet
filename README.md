# EchoNet

A RESTful Social Media API built with Go, designed for developers. Features posts, comments, followers, user authentication, role-based access control, and a personalized feed.

## Tech Stack

- **Go** with [Chi](https://github.com/go-chi/chi) router
- **PostgreSQL** — primary database
- **Redis** — optional caching layer
- **SendGrid** — email delivery (user invitations)
- **JWT** — token-based authentication
- **Swagger** — API documentation
- **Docker** — local infrastructure

## Project Structure

```
cmd/
  api/          # HTTP handlers, middleware, server setup
  migrate/      # DB migrations and seed data
internal/
  auth/         # JWT & basic auth
  db/           # DB connection & seeding
  mailer/       # SendGrid email client
  ratelimiter/  # Fixed-window rate limiter
  store/        # Data access layer (PostgreSQL + Redis cache)
docs/           # Auto-generated Swagger docs
```

## Getting Started

### Prerequisites

- Go 1.25+
- Docker & Docker Compose
- [golang-migrate](https://github.com/golang-migrate/migrate) CLI
- [swag](https://github.com/swaggo/swag) CLI (for docs generation)

### 1. Start Infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL (port 5432), Redis (port 6379), and Redis Commander (port 8081).

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Default | Description |
|---|---|---|
| `ADDR` | `:4000` | Server listen address |
| `DB_ADDR` | `postgres://admin:adminpassword@localhost/echonet?sslmode=disable` | PostgreSQL DSN |
| `REDIS_ADDR` | `localhost:6379` | Redis address |
| `REDIS_ENABLED` | `false` | Enable Redis caching |
| `SENDGRID_API_KEY` | — | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | — | Sender email address |
| `AUTH_TOKEN_SECRET` | `example` | JWT signing secret |
| `AUTH_BASIC_USER` | `admin` | Basic auth username (health endpoint) |
| `AUTH_BASIC_PASS` | `admin` | Basic auth password |
| `RATE_LIMITER_ENABLED` | `true` | Enable rate limiting |
| `ENV` | `development` | Environment name |

### 3. Run Migrations

```bash
make migrate-up
```

### 4. Seed Database (optional)

```bash
make seed
```

### 5. Run the Server

```bash
go run ./cmd/api
```

The API will be available at `http://localhost:4000`.

## API Endpoints

Base path: `/api/v1`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Basic | Health check |
| `POST` | `/authentication/user` | — | Register user |
| `POST` | `/authentication/token` | — | Login / get JWT |
| `PUT` | `/users/activate/{token}` | — | Activate account |
| `GET` | `/users/feed` | JWT | Get personalized feed |
| `GET` | `/users/{userID}` | JWT | Get user profile |
| `PUT` | `/users/{userID}/follow` | JWT | Follow a user |
| `PUT` | `/users/{userID}/unfollow` | JWT | Unfollow a user |
| `POST` | `/posts` | JWT | Create post |
| `GET` | `/posts/{postID}` | JWT | Get post |
| `PATCH` | `/posts/{postID}` | JWT (moderator+) | Update post |
| `DELETE` | `/posts/{postID}` | JWT (admin+) | Delete post |

Interactive docs available at: `http://localhost:4000/api/v1/docs/`

## Makefile Commands

```bash
make migrate-up                    # Apply all migrations
make migrate-down <n>              # Roll back n migrations
make migration-create <name>       # Create a new migration
make migrate-force <version>       # Force migration version
make seed                          # Seed the database
make gen-docs                      # Regenerate Swagger docs
```

## License

Apache 2.0
