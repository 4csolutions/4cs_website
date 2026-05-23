FROM node:20-alpine
WORKDIR /app

# Install curl for robust health checks in Coolify environment
RUN apk add --no-cache curl

# Copy manifests and install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source files
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
