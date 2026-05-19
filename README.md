# SpKuLeHaS API

## Collaborators

- [Scott Schipke](https://github.com/sschipke)

## Local startup

From the repository root, with **Node 20+** and **Docker** (or any Postgres you can reach with the URLs in `.env`).

**1. Environment**

Copy [`.env.example`](.env.example) to `.env`, set `TOKEN_SECRET` (for example `openssl rand -base64 32`), and adjust `DATABASE_URL` / `DATABASE_URL_TEST` if your Postgres is not on `127.0.0.1:5432`. If you omit those variables, [`src/knexfile.js`](src/knexfile.js) defaults to user **`postgres`** on **`127.0.0.1:5432`** (same as the Docker snippet below). A URL like `postgres://localhost/spkulehas` with no username makes `pg` use your **macOS login** as the role, which fails against the Docker image with `role "YourName" does not exist` unless you create that role.

**2. Postgres (Docker, first time)**

```bash
docker run -d --name spkulehas-pg \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  -p 5432:5432 \
  -v spkulehas-pgdata:/var/lib/postgresql/data \
  postgres:16-alpine

docker exec spkulehas-pg psql -U postgres -c "CREATE DATABASE spkulehas;"
docker exec spkulehas-pg psql -U postgres -c "CREATE DATABASE spkulehas_test;"
```

*(If a database already exists, Postgres returns an error; that is safe to ignore.)*

Later: `docker start spkulehas-pg` if the container is stopped. Skip the `docker run` / `CREATE DATABASE` steps if you already have databases.

**3. Dependencies**

```bash
npm install
```

(Yarn 4 works too if you use Corepack; `package.json` scripts work with either.)

**4. Migrations and seeds (first time or after schema changes)**

```bash
npm run migrate:dev    # database: spkulehas
npm run migrate:test   # database: spkulehas_test
npm run seed:test      # fixture users + reservations on spkulehas_test
```

`npm run initdb` runs migrate + seed for the **development** database only (dev seeds expect existing users; prefer `seed:test` for a full local fixture on `spkulehas_test`).

**5. Run the API**

Against the **test** database (matches `seed:test`):

```bash
npm run dev:test
```

Against the **development** database:

```bash
npm run dev
```

The API listens on **http://localhost:8080** by default (`PORT` overrides). Smoke check:

```bash
curl -i http://localhost:8080/api/v1/monitor
```

Expect HTTP `204`.

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

Install dependencies, copy `.env` from `.env.example`, then start the API (see **Local startup** for Postgres, migrate, and seed commands). Quick start after setup:

```bash
npm run dev
```

To run the compiled output without Docker: `yarn compile`, then from the `build/` layout (or `yarn start` if aligned with your local setup).

### Database migrations (local)

Against a database you can reach from your shell:

```bash
DATABASE_URL='postgres://…' NODE_ENV=staging yarn migrate:dev
```

For the default local Knex setup, prefer the npm scripts in **Local startup** (`migrate:dev`, `migrate:test`, etc.), which load `.env` and pass `--knexfile ./src/knexfile.js`.

### Useful commands:

To generate a secret key run `openssl rand -base64 32`

To start the server locally: `yarn start`

##### To Compile with Babel

`npx babel src --out-dir build`

<details>
  <summary>Env Variables</summary>

- `PGSSLMODE`
- `TOKEN_SECRET`
- `DATABASE_URL` (development / Knex when using `.env`)
- `DATABASE_URL_TEST` (test database / Knex when using `.env`)

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
