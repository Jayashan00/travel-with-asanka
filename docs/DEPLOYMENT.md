# Deployment notes

## Backend (Spring Boot)

```bash
cd backend
mvn clean package
java -jar target/travel-backend-1.0.0.jar
```

Override settings without editing files:

```bash
java -jar target/travel-backend-1.0.0.jar \
  --spring.data.mongodb.uri="mongodb+srv://user:pass@cluster.mongodb.net/travelwithasanka" \
  --app.cors-origins="https://travelwithasanka.com" \
  --app.jwt.secret="a-long-random-string-at-least-32-characters" \
  --app.admin.username="asanka" \
  --app.admin.password="a-strong-password" \
  --app.upload-dir=/var/www/travel-uploads
```

Keep `app.upload-dir` **outside** the deployment folder so uploaded photos survive a redeploy, and
back it up with the database.

### Run it as a service (Linux)

`/etc/systemd/system/travel-api.service`

```ini
[Unit]
Description=Travel With Asanka API
After=network.target mongod.service

[Service]
User=www-data
WorkingDirectory=/opt/travel
ExecStart=/usr/bin/java -jar /opt/travel/travel-backend-1.0.0.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now travel-api
```

## Frontend (React)

```bash
cd frontend
echo 'VITE_API_URL=https://api.travelwithasanka.com' > .env.production
npm run build
```

Upload `frontend/dist/` to the web host.

### Nginx

A React site needs every path to fall back to `index.html`, otherwise refreshing `/vehicles`
returns a 404.

```nginx
server {
    listen 443 ssl;
    server_name travelwithasanka.com;

    root /var/www/travel/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

With this proxy in place set `VITE_API_URL` to an empty value or the same domain, so the browser
calls `/api/...` on the same host and no CORS setup is needed at all.

### Netlify / Vercel

Add a rewrite so all routes serve `index.html`, and set `VITE_API_URL` to the API address in the
project's environment variables.

## Database backup

```bash
mongodump --uri="mongodb://localhost:27017/travelwithasanka" --out=/backup/$(date +%F)
```

Back up the uploads folder at the same time.
