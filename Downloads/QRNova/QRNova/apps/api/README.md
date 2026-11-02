# QRNova server

The Go server that provides the REST API (`/api/v1`), redirects for dynamic codes (`/r/{slug}`), analytics and, optionally, the built web app.

```bash
cd apps/api
go run .                 # SQLite at ./data/QRNova.db, listening on :8080
go run . -migrate        # apply migrations and exit
go run . -version
```

## Configuration

All settings are `QRNova_*` environment variables, and all are optional.

| Variable | Default | Description |
| --- | --- | --- |
| `QRNova_ADDR` | `:8080` | Listen address. `PORT` is used when this is not set. |
| `QRNova_BASE_URL` | `http://localhost:8080` | Public URL used in redirect links and emails. |
| `QRNova_DATABASE_URL` | `sqlite://data/QRNova.db` | `sqlite://path` or `postgres://user:pass@host:5432/db?sslmode=disable`. |
| `QRNova_WEB_DIR` | empty | Directory of the built web app (`apps/web/dist`) to serve with client-side routing. |
| `QRNova_COOKIE_SECURE` | `auto` | `true` or `false`. `auto` marks cookies `Secure` when the base URL uses HTTPS. |
| `QRNova_TRUSTED_PROXIES` | empty | Comma-separated CIDRs allowed to set `X-Forwarded-For` and `X-Real-IP`. |
| `QRNova_COUNTRY_HEADER` | empty | Header containing an ISO country code set by a proxy or CDN, such as `CF-IPCountry`. |
| `QRNova_REGISTRATION` | `open` | Initial registration mode, `open` or `closed`. Administrators can change it later. |
| `QRNova_ADMIN_EMAIL`, `QRNova_ADMIN_PASSWORD` | empty | Administrator created on first start. |
| `QRNova_SMTP_HOST`, `_PORT`, `_USERNAME`, `_PASSWORD`, `_FROM` | empty | SMTP settings for password reset email. Without SMTP, reset links are written to the log. |
| `QRNova_MAX_BODY_BYTES` | `1048576` | Maximum API request body size. |
| `QRNova_CUSTOM_DOMAIN_SCHEME` | `https` | Scheme used in redirect links on verified custom domains. |
| `QRNova_LOG_FORMAT` | `text` | `text` or `json`. |
| `QRNova_RATE_LIMIT_API`, `_API_KEY`, `_AUTH`, `_REDIRECT` | `600`, `600`, `10`, `120` | Requests per minute, per IP or per API key. |
| `QRNova_FILE_UPLOADS` | `disabled` | `enabled` lets dynamic codes serve uploaded files. |
| `QRNova_FILE_DIR`, `_MAX_BYTES`, `_QUOTA_BYTES` | `data/files`, `10485760`, `104857600` | Upload directory, largest file and storage per user. |

## API reference

The API is described in [`openapi.yaml`](./openapi.yaml), which the server also serves at `/api/v1/openapi.yaml`.

## Source layout

| Package | Responsibility |
| --- | --- |
| `server/config` | Environment configuration |
| `server/storage` | Database access for SQLite and PostgreSQL |
| `server/migrations` | Embedded SQL migrations and runner |
| `server/auth` | Passwords, sessions, API keys, password reset, SMTP |
| `server/security` | Rate limiting, client IPs, headers, destination validation |
| `server/files` | Optional on-disk storage for uploaded files |
| `server/analytics` | User-agent parsing, bot detection, visitor hashing, reports |
| `server/redirect` | `/r/{slug}` handler and status pages |
| `server/settings` | Runtime settings edited by administrators |
| `server/api` | REST handlers and background jobs |
| `server/web` | Static file serving for the web app |

## Tests

```bash
go test ./server/... ./apps/api/...
```

Set `QRNova_TEST_POSTGRES_URL` to also run the storage and API tests against PostgreSQL.
