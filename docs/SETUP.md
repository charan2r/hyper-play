# Setup and operations

## Prerequisites

| Dependency       | Recommended version           | Used for                           |
| ---------------- | ----------------------------- | ---------------------------------- |
| Node.js          | 20 or newer                   | Backend and Vite tooling           |
| npm              | Version bundled with Node 20+ | Reproducible installs via `npm ci` |
| PostgreSQL       | 15                            | Application data                   |
| Stripe CLI       | Current                       | Forwarding local webhook events    |
| Docker + Compose | Current                       | Optional container workflow        |

An AWS S3 bucket and Stripe test account are required for the complete product-upload and checkout flows.

## Environment configuration

Copy each example without committing the resulting `.env` files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
```

### Backend variables

| Variable                 | Required | Description                                                       |
| ------------------------ | -------- | ----------------------------------------------------------------- |
| `PORT`                   | Yes      | Express listen port; use `5000` for documented URLs               |
| `NODE_ENV`               | Yes      | `development` or `production`; rate limits run only in production |
| `DATABASE_URL`           | Yes      | Full PostgreSQL connection URL                                    |
| `JWT_SECRET`             | Yes      | Secret used to sign and verify seven-day JWTs                     |
| `FRONTEND_URL`           | Yes      | Allowed customer SPA origin and Stripe redirect origin            |
| `ADMIN_URL`              | Yes      | Allowed operations SPA origin                                     |
| `STRIPE_SECRET_KEY`      | Checkout | Stripe server-side key                                            |
| `STRIPE_PUBLISHABLE_KEY` | Reserved | Present in configuration; not currently read by application code  |
| `STRIPE_WEBHOOK_SECRET`  | Webhooks | Signing secret used to verify Stripe events                       |
| `AWS_REGION`             | Uploads  | S3 bucket region                                                  |
| `AWS_ACCESS_KEY`         | Uploads  | AWS access-key ID                                                 |
| `AWS_SECRET_KEY`         | Uploads  | AWS secret access key                                             |
| `AWS_BUCKET_NAME`        | Uploads  | Destination bucket for `products/` objects                        |

Use a long random `JWT_SECRET`. Never expose backend, database, Stripe secret, webhook, or AWS credentials through a `VITE_` variable.

### SPA variables

Both `frontend/.env` and `admin/.env` use:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Vite embeds this value during the build. Restart the dev server or rebuild the image after changing it.

## Database

The application expects PostgreSQL through `DATABASE_URL`. For local development:

```text
postgresql://postgres:change_this_password@localhost:5432/sports
```

For the Compose `db` service:

```text
postgresql://postgres:change_this_password@db:5432/sports
```

## Local development

Install dependencies:

```bash
cd backend
npm i
```

```bash
cd frontend
npm i
```

```bash
cd admin
npm i
```

Start each process in a separate terminal:

```bash
cd backend
npm start
```

```bash
cd frontend
npm run dev
```

```bash
cd admin
npm run dev
```

Expected URLs:

- Customer SPA: `http://localhost:5173`
- Operations SPA: `http://localhost:5174`
- API base: `http://localhost:5000/api/v1`
- Health: `http://localhost:5000/health`

## Stripe webhook testing

With the backend running:

```bash
stripe login
stripe listen --forward-to localhost:5000/api/v1/payments/webhook
```

Copy the emitted `whsec_...` value into `backend/.env` as `STRIPE_WEBHOOK_SECRET`, then restart the backend. The active handlers are:

- `checkout.session.completed`
- `payment_intent.payment_failed`

The webhook endpoint must receive Stripe's raw body. Do not move it behind the global JSON parser in `backend/server.js`.

## Docker Compose

For container builds, set both SPA environment files to the relative API prefix:

```env
VITE_API_URL=/api/v1
```

Set backend browser origins to the host-facing URLs:

```env
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

Ensure `backend/.env` uses the Compose database hostname `db`. The Compose database defaults are user `postgres`, password `change_this_password`, and database `sports`.

Build and start:

```bash
docker compose up --build
```

Services:

| Service        | Host address            |
| -------------- | ----------------------- |
| Customer SPA   | `http://localhost:3000` |
| Operations SPA | `http://localhost:3001` |
| API            | `http://localhost:5000` |
| PostgreSQL     | `localhost:5434`        |

Stop services:

```bash
docker compose down
```

`docker compose down -v` also deletes the PostgreSQL volume and is destructive; use it only when a full database reset is intended.

> [!NOTE]
> Compose creates the database container and persistent volume but does not create application tables. Initialize the compatible schema before using the applications.

## Build and quality checks

```bash
cd frontend
npm run lint
npm run build
```

```bash
cd admin
npm run lint
npm run build
```

## Troubleshooting

### Browser reports a CORS error

Match `FRONTEND_URL` and `ADMIN_URL` exactly to the browser origins, including scheme and port and excluding paths. Restart the backend after changing them.

### SPA requests have duplicated or missing `/api/v1`

`VITE_API_URL` must be the API base, not only the server origin. Use `http://localhost:5000/api/v1` locally or `/api/v1` behind the supplied Nginx proxy.

### Database connects locally but not in Compose

Use `db:5432` inside the backend container. `localhost:5434` is only the address used by tools running on the host.

### Product creation fails

Confirm the JWT belongs to an admin, the multipart file field is named `image`, all required product fields are present, and the four AWS variables point to a writable bucket.

### Stripe redirects but orders remain pending

Confirm the Stripe CLI or public webhook points to `/api/v1/payments/webhook`, `STRIPE_WEBHOOK_SECRET` matches that endpoint, and the webhook event reaches the backend unchanged.

### Admin or manufacturer cannot sign in

These accounts cannot be created through the current API. Confirm a row exists in the appropriate table and that its password is bcrypt-hashed.
