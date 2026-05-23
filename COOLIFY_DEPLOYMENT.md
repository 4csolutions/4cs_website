# Deploying 4C Solutions Website on Coolify

This guide covers deployment instructions for the full-stack 4C Solutions website on Coolify using Docker Compose.

---

## Architecture Overview

Our deployment leverages a highly secure, high-performance Docker Compose stack:
1. **`mongo`**: Persistent MongoDB database container.
2. **`backend`**: Node.js + Express API server which runs database queries and seeds the initial dataset.
3. **`frontend`**: Nginx production web server serving the compiled React Vite SPA.

> [!NOTE]
> **Nginx Reverse Proxy**: Unlike standard setups requiring separate frontend and backend domains (which cause CORS issues), our Nginx server is configured to reverse-proxy `/api/*` and `/uploads/*` requests internally to the `backend` container. Therefore, you only need **one single subdomain** (e.g., `https://4csolutions.in`), keeping deployment simple and secure.

---

## Prerequisites

- A Coolify v4+ instance.
- A Git repository containing this project.
- A single domain or subdomain ready: e.g., `https://4csolutions.in` (points directly to the `frontend` container on port `80`).

---

## Deployment Steps

1. In Coolify: **+ New Resource → Docker Compose**.
2. Connect your Git repository and choose branch `main` (or equivalent).
3. Set the Docker Compose file path to `docker-compose.yml`.
4. Under **Environment Variables**, paste the following and configure real values:
   ```env
   JWT_SECRET=<long-random-string>
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   CONTACT_EMAIL=syedmujeerhashmi@gmail.com
   ```
5. Under **Domains**, assign:
   - `frontend` service → `https://4csolutions.in` (port `80`)
   - `backend` service  → *Leave empty* (Only exposed internally to Nginx, making it highly secure!)
6. **Persistent Storage**:
   - `mongo_data` (MongoDB data files)
   - `backend_uploads` (Client logos and avatar uploads)
   Coolify will automatically provision these persistent volumes.
7. Click **Deploy**.

---

## Post-deployment checklist

- [ ] Submit a contact form and verify that the message is logged in the database (viewable in the Admin Inbox) and dispatched via NodeMailer.
- [ ] Visit `/login`, sign in with the default seeded credentials (`admin` / `admin123`), and verify that you can access the admin workspace.
- [ ] **Important**: Once logged into the dashboard, go to the Profile/Settings panel and change the administrator password from `admin123` to a secure custom password.
