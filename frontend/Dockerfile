FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency manifests and install with peer resolution
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build production SPA assets
COPY . .
RUN npm run build

# Nginx Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
