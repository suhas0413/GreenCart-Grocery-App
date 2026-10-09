# GreenCart API

Express API backed by MongoDB. The React client talks to this server through Vite's `/api` proxy during development.

## Run locally

1. Start a local MongoDB server, or create an Atlas connection string.
2. From `server/`, install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI` and a unique `JWT_SECRET` (at least 32 characters).
4. Run `npm run seed` to add a few starter products. Existing products are left unchanged.
5. Run `npm run dev` to start the API on port 5000.
6. In a second terminal, run the client with `cd ../client && npm run dev`.

## Routes

- `GET /api/health` checks the API and database connection.
- `POST /api/auth/register` accepts `{ "name", "email", "password" }`.
- `POST /api/auth/login` accepts `{ "email", "password" }`.
- `GET /api/auth/me` returns the signed-in user; send `Authorization: Bearer <token>`.
- `GET /api/products` returns the catalog; optional `category`, `search`, `page`, and `limit` query parameters are supported.
- `POST /api/orders` creates an order for the signed-in user from `{ "items": [{ "productId", "quantity" }] }`.
- `GET /api/orders/mine` returns only the signed-in user's orders.

Passwords are hashed with bcrypt. Order prices and product names are copied from the database at purchase time; totals are calculated by the server. Payment processing and seller product management are not included.