# 4C Solutions - Professional Enterprise ERPNext Website

A high-performance, dynamic, and clean professional website designed for **4C Solutions** (ERPNext Solution Provider). 

This is a full-stack JavaScript application built with a **Vite + React** SPA frontend and a **Node.js + Express** API backend, powered securely by a **MongoDB** database (via Mongoose). It is fully containerized and optimized for one-click deployment using **Coolify**.

---

## Technical Features

1. **Vite + React SPA**: Responsive, lightweight frontend using **Vanilla CSS** for premium styling, animations, and transitions.
2. **Dynamic Sector popup Grids**: Fetches sectors, descriptions, and feature lists dynamically from MongoDB. Clicking cards triggers elegant details modals.
3. **Mongoose Database Schema**: Secure schemas representing Sectors, Testimonials, Client Logos ticker, Case Studies, and Contact Us forms.
4. **NodeMailer Mail Dispatcher**: Sends dynamic HTML-formatted email alerts to your contact desk on new enquiries, with robust MongoDB inbox fallbacks.
5. **Secure Admin Dashboard**: SECURE token-based admin panel to manage sectors, edit testimonials, list client logos, and write markdown-enabled case studies.
6. **SEO & AEO Optimizations**: Auto-injects index metadata and structured JSON-LD schemas representing `ProfessionalService` for indexing by Gemini, Perplexity, and Google.

---

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Installation
In the root directory, install all dependencies for both workspaces:
```bash
npm run install-all
```

### 2. Start Local Environment (Concurrently)
Start both the Express API backend (Port `5000`) and the Vite React frontend (Port `5173`) concurrently:
```bash
npm run dev
```

### 3. Default Admin Credentials
When database boots for the first time, the seeding script automatically generates the default credentials for the **Security Access Portal** at `/login`:
- **Username**: `admin`
- **Password**: `admin123` *(Hashed securely in MongoDB)*

---

## Environment Variables (`.env`)
Create a `.env` file in the `backend/` directory to configure custom parameters:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/4cs_website
JWT_SECRET=your_custom_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
CONTACT_EMAIL=syedmujeerhashmi@gmail.com
```

---

## Coolify Deployment (Production)

Deploying on **Coolify** is incredibly simple as a single-container service:

1. Create a new **Private Repository** resource in Coolify pointing to this repository.
2. Under **Build Pack**, select `Dockerfile`.
3. Link a **MongoDB database service** inside your Coolify project.
4. Add the `MONGODB_URI` environment variable pointing to your linked database.
5. Coolify will trigger the multi-stage Docker build, compile your React client, bundle it inside the Express server, and expose the website on port `5000` with zero complex setups!
