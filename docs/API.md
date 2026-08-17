# API reference

Base URL `http://localhost:8080`. All responses are JSON.

## Public (no token)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/settings` | Brand, hero slides, contact details |
| GET | `/api/vehicles` | Active vehicles |
| GET | `/api/vehicles/{slug}` | One vehicle |
| GET | `/api/posts` | Published destination guides |
| GET | `/api/posts/{slug}` | One guide |
| GET | `/api/testimonials` | Approved reviews |
| GET | `/api/gallery` | Active photos |
| GET | `/api/services` | Active services |
| POST | `/api/messages` | Send a contact message |
| POST | `/api/bookings` | Send a booking request, returns a reference |
| POST | `/api/testimonials` | Submit a review (held for approval) |

## Sign in

`POST /api/auth/login` with `{ "username": "...", "password": "..." }` returns
`{ "token": "..." }`. Send it on admin calls as `Authorization: Bearer <token>`.
Tokens last 12 hours by default.

## Admin (token required)

| Method | Path |
|---|---|
| GET | `/api/admin/stats` |
| GET/POST/PUT/DELETE | `/api/admin/vehicles[/{id}]` |
| GET/POST/PUT/DELETE | `/api/admin/posts[/{id}]` |
| GET/POST/PUT/DELETE | `/api/admin/testimonials[/{id}]` |
| GET/POST/PUT/DELETE | `/api/admin/gallery[/{id}]` |
| GET/POST/PUT/DELETE | `/api/admin/services[/{id}]` |
| GET/DELETE | `/api/admin/messages[/{id}]`, PATCH `/{id}/read` |
| GET/DELETE | `/api/admin/bookings[/{id}]`, PATCH `/{id}/status` |
| PUT | `/api/admin/settings` |
| POST | `/api/admin/upload` (multipart field `file`) → `{ "url": "/uploads/…" }` |
| POST | `/api/admin/auth/password` |

Errors come back as `{ "error": "a sentence you can show the user" }`, and validation failures add
a `fields` object keyed by field name.
