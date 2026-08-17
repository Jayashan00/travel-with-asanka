# Travel With Asanka — full website (React + Spring Boot + MongoDB)

A complete rebuild of the travelwithasanka.com travel site: a light, animated marketing site
plus an admin panel where the owner can change **every image, price, story and review** without
touching code.

```
travel-with-asanka/
├── backend/     Spring Boot 3 + MongoDB REST API
├── frontend/    React 18 + Vite + Tailwind + Framer Motion
├── docs/        Client guide and deployment notes
└── tools/       Script that generated the starter artwork
```

---

## 1. What you need installed

| Tool | Version | Check with |
|---|---|---|
| Java JDK | 17 or newer | `java -version` |
| Maven | 3.8+ | `mvn -v` |
| Node.js | 18 or newer | `node -v` |
| MongoDB Community Server | 6 or 7 | runs on `localhost:27017` |
| MongoDB Compass | latest | (optional, to view the data) |

MongoDB must be running before you start the backend.

---

## 2. Start the backend

```bash
cd backend
mvn spring-boot:run
```

It starts on **http://localhost:8080**.

On the very first run the database `travelwithasanka` is created and filled with the starter
content: 7 vehicles, 8 destination guides, 8 reviews, 12 gallery photos, 6 services, the homepage
slideshow and one admin account.

**Admin sign in:** username `admin`, password `asanka@2026`
Change both in `backend/src/main/resources/application.properties` before going live, or change
the password from inside the admin panel.

To see the data in **MongoDB Compass**, connect to `mongodb://localhost:27017` and open the
`travelwithasanka` database.

---

## 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

- Public site: `/`
- Admin panel: `/admin`

The API address lives in `frontend/.env` (`VITE_API_URL`). It already points at
`http://localhost:8080`.

---

## 4. Pages that exist

| Route | What it is |
|---|---|
| `/` | Home: hero slideshow, trust bar, services, fleet, promises, destinations, Ceylon panel, reviews, CTA |
| `/about` | About Us, the four facts, "working together", how a trip works |
| `/vehicles` | Fleet with category filter and a full tariff table |
| `/vehicles/:slug` | One vehicle: specs, what's included, prices, booking form |
| `/blog` | Destination guides with search |
| `/blog/:slug` | Full guide with sidebar and related guides |
| `/gallery` | Masonry gallery with albums and a keyboard-navigable lightbox |
| `/reviews` | Rating breakdown, review filter by source, and a public "leave a review" form |
| `/contact` | Contact details, map, message form, and the full booking request form |
| `/admin` | Dashboard, bookings, messages, site content, vehicles, destinations, gallery, reviews, services |

---

## 5. The admin panel

Everything the client asked about — "if the client wants to change the images and previews later,
that facility should also be there" — is here.

- **Site content** — brand name, logo, the whole homepage slideshow (image, heading, subheading and
  button per slide, reorder and delete), About page text and pictures, the Ceylon section, contact
  details, social links and the ratings shown on the site.
- **Vehicles / Destinations / Gallery / Reviews / Services** — add, edit, delete, reorder, hide.
- **Images** — in any form, click **Upload image** to pick a file from the computer, or paste an
  image address. Uploads are saved to `backend/uploads/` and served at `/uploads/...`.
- **Bookings** — every request from the site with a reference number, and a status you can move
  through New → Confirmed → Completed → Cancelled.
- **Messages** — contact form enquiries with read/unread.

Reviews submitted by visitors on the public site stay hidden until approved in the admin panel.

---

## 6. Starter artwork

`frontend/public/images/` holds hand-built SVG illustrations (Sigiriya, safari, tea country, south
coast, temple, waterfall, train, and each vehicle). They exist so a fresh clone looks finished
immediately and never depends on an outside image host.

Replace them with Asanka's own photographs from the admin panel — no code change needed. Photos
around 1600×1000 px work best for hero slides.

---

## 7. Building for production

```bash
cd frontend && npm run build      # output in frontend/dist
cd ../backend && mvn clean package # output in backend/target/travel-backend-1.0.0.jar
```

See `docs/DEPLOYMENT.md` for hosting notes, including the one Nginx rule a React router needs.

---

## 8. Notes on security

Before going live:

1. Change `app.admin.username` / `app.admin.password`.
2. Replace `app.jwt.secret` with a long random string.
3. Set `app.cors-origins` to the real site address.
4. Point `spring.data.mongodb.uri` at the production database (MongoDB Atlas works unchanged).
5. Serve everything over HTTPS.
