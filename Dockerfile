# ==========================================
# STAGE 1: Build Frontend React SPA
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy dependencies manifest
COPY frontend/package*.json ./
RUN npm install

# Copy source code and compile static assets
COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Package Backend and Run Server
# ==========================================
FROM node:20-alpine AS production-runner
WORKDIR /app/backend

# Copy backend manifest and install dependencies
COPY backend/package*.json ./
RUN npm install --only=production

# Copy backend source files
COPY backend/ ./

# Copy built React assets from Stage 1
# backend/server.js looks for "../frontend/dist" which matches this exactly
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose API and frontend single-port
EXPOSE 5000

# Environment variables defaults
ENV PORT=5000
ENV NODE_ENV=production

# Start Express Production Server
CMD ["node", "server.js"]
