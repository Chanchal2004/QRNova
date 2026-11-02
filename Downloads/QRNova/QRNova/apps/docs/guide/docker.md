# Docker

The QRNova image contains the Go server and the built web app. The repository includes three Compose configurations.

| File | Services |
| --- | --- |
| `docker-compose.yml` | PostgreSQL 17 and QRNova on port 80 (default) |
| `docker/docker-compose.sqlite.yml` | QRNova only, with SQLite stored in a volume |
| `docker/docker-compose.caddy.yml` | Overlay that adds Caddy for HTTPS and custom domains |

The image is built from `docker/Dockerfile` in three stages: Node.js builds the web app, Go builds a static binary (`CGO_ENABLED=0`; the SQLite driver is pure Go), and the runtime stage is Alpine running as an unprivileged user (UID 10001). The container listens on port `8080`, stores SQLite data in `/data` and defines a health check on `/api/v1/health`.

Prebuilt images are published to `ghcr.io/kspkr/QRNova` by the repository's Docker workflow.

## Quick start with PostgreSQL

```bash
git clone https://github.com/kspkr/QRNova.git
cd QRNova
docker compose up -d
```

Open <http://localhost> and register. The first account becomes the administrator.

PostgreSQL is also published on `127.0.0.1:5432` (localhost only) so a development server can use it.

## Configuration

Compose reads a `.env` file next to `docker-compose.yml`. Start from the example:

```bash
cp .env.example .env
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `QRNova_BASE_URL` | `http://localhost` | Public URL used in dynamic code links. Set it before printing any dynamic codes. |
| `QRNova_PORT` | `80` | Host port. |
| `POSTGRES_PASSWORD` | `QRNova` | Database password. Change it before exposing the server. |
| `QRNova_REGISTRATION` | `open` | `open` or `closed`. |
| `QRNova_ADMIN_EMAIL`, `QRNova_ADMIN_PASSWORD` | empty | Create an administrator on first start. |
| `QRNova_TRUSTED_PROXIES` | empty | CIDRs whose `X-Forwarded-For` header is trusted. |
| `QRNova_COUNTRY_HEADER` | empty | Header containing a two-letter country code, such as `CF-IPCountry`. |
| `QRNova_SMTP_*` | empty | Optional SMTP settings for password reset email. |
| `QRNova_DOMAIN`, `ACME_EMAIL` | empty | Used by the Caddy overlay. |

[Self-hosting](./self-hosting#configuration) lists every server variable.

## SQLite in a single container

```bash
docker compose -f docker/docker-compose.sqlite.yml up -d
```

The database is stored at `/data/QRNova.db` in the `QRNova-data` volume. This setup suits personal and small-team installations on one machine.

## HTTPS and custom domains with Caddy

[Caddy](https://caddyserver.com) is open source and obtains certificates from Let's Encrypt.

```bash
QRNova_DOMAIN=qr.example.com ACME_EMAIL=you@example.com \
  docker compose -f docker-compose.yml -f docker/docker-compose.caddy.yml up -d
```

The overlay:

- removes QRNova's published port and exposes Caddy on ports 80 and 443,
- sets `QRNova_BASE_URL=https://$QRNova_DOMAIN` and trusts private-network proxies so client IPs are recorded correctly,
- mounts `docker/Caddyfile`, which serves the primary domain and uses on-demand TLS for custom domains. Before issuing a certificate for a new hostname, Caddy calls `GET /api/v1/domains/check?domain=<host>`. QRNova returns 200 only for the primary host and verified custom domains.

Point the domain's `A`/`AAAA` records at the server before starting. See [Custom domains](./custom-domains).

## Backups

PostgreSQL:

```bash
docker compose exec -T postgres pg_dump -U QRNova QRNova | gzip > QRNova-$(date +%F).sql.gz

# Restore into an empty database
gunzip -c QRNova-2026-01-01.sql.gz | docker compose exec -T postgres psql -U QRNova QRNova
```

SQLite: the runtime image does not include the `sqlite3` tool, so stop the server and copy the file out of the volume:

```bash
docker compose -f docker/docker-compose.sqlite.yml stop QRNova
docker volume ls | grep QRNova-data          # the name is prefixed with the Compose project name
docker run --rm -v <volume-name>:/data -v "$PWD":/backup alpine \
  cp /data/QRNova.db /backup/QRNova-$(date +%F).db
docker compose -f docker/docker-compose.sqlite.yml start QRNova
```

SQLite runs in WAL mode. Copying the database while the server is running would also require `QRNova.db-wal`, which is why the server is stopped first.

## Upgrading

```bash
git pull
docker compose build
docker compose up -d
```

Migrations run at startup and are recorded in `schema_migrations`, so running them again has no effect. Take a backup before upgrading.

## Logs and health

```bash
docker compose logs -f QRNova
curl http://localhost/api/v1/health     # {"status":"ok","version":"0.1.0","database":"ok"}
```

When SMTP is not configured, password reset links are written to these logs. See [Self-hosting](./self-hosting#email).
