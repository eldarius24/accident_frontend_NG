# Build stage
FROM node:20.8.0-alpine3.18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20.8.0-alpine3.18
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/build ./build
EXPOSE 3000

# Installer serve pour servir l'application en production
RUN npm install -g serve

# Utiliser serve pour servir l'application
CMD ["serve", "-s", "build", "-l", "3000"]