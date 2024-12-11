# Étape de build
FROM node:20.8.0-alpine3.18 as builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier les fichiers source
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape de production
FROM nginx:alpine

# Copier les fichiers buildés depuis l'étape de build
COPY --from=builder /app/build /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]