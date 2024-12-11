FROM node:20.8.0-alpine3.18

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances d'abord
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .
ENV CI=true
ENV NODE_ENV=production
# Build l'application pour la production
RUN npm run build

# Exposer le port
EXPOSE 3000

# Installer serve globalement
RUN npm install -g serve

# Démarrer l'application
CMD ["serve", "-s", "build", "-l", "3000"]