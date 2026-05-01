# SpKuLeHaS API

## Collaborators

- [Scott Schipke](https://github.com/sschipke)

### Local testing (Docker)

Build the same image the app uses on Fly:

```bash
docker build -t spkulehas-api:local .
```

If Yarn registry access fails behind a TLS‑inspecting proxy (self‑signed CA in the chain), you can use:

```bash
docker build --build-arg DOCKER_TLS_INSECURE=1 -t spkulehas-api:local .
```

Use that only for debugging on locked‑down networks—not for production artifacts.

Run with env vars your app and Knex need (`NODE_ENV` selects the block in `src/knexfile.js`; use `staging` or `production` for remote‑style DB config). Example:

```bash
docker run --rm \
  -p 8080:8080 \
  -e PORT=8080 \
  -e HOSTNAME=0.0.0.0 \
  -e NODE_ENV=staging \
  -e DATABASE_URL='postgres://USER:PASSWORD@host.docker.internal:5432/spkulehas' \
  -e TOKEN_SECRET='your-secret' \
  -e ADMIN_EMAIL='you@example.com' \
  -e ADMIN_EMAIL_PASSWORD='smtp-password-if-needed' \
  spkulehas-api:local
```

On macOS/Windows, `host.docker.internal` reaches Postgres on the host. Adjust `DATABASE_URL` if your DB is elsewhere.

Smoke check:

```bash
curl -i http://localhost:8080/api/v1/monitor
```

Expect HTTP `204`.

### Local development (no Docker)

Install dependencies, set environment (for example a local `.env`; see **Env Variables** below), then:

```bash
yarn dev
```

To run the compiled output without Docker: `yarn compile`, then from the `build/` layout (or `yarn start` if aligned with your local setup).

### Database migrations (local)

Against a database you can reach from your shell:

```bash
DATABASE_URL='postgres://…' NODE_ENV=staging yarn migrate:dev
```

### Useful commands:

To generate a secret key run `openssl rand -base64 32`

To start the server locally: `yarn start`

##### To Compile with Babel

`npx babel src --out-dir build`

<details>
  <summary>Env Variables</summary>

- `PGSSLMODE`
- `TOKEN_SECRET`

</details>

### Fly.io deploy (CLI)

From the repository root (with [Fly CLI auth](https://fly.io/docs/hands-on/install-flyctl/); `fly deploy` is shorthand for `flyctl deploy`):

```bash
flyctl deploy . --config flyEnv/fly.staging.toml --remote-only
```

```bash
flyctl deploy . --config flyEnv/fly.production.toml --remote-only
```

If builds hang on “Waiting for depot builder…”, try adding `--depot=false`.
