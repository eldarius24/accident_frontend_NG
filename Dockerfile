# Utiliser l'image de base officielle Node.js
FROM node:20.8.0-alpine3.18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de l'application vers le répertoire de travail
COPY package*.json ./

# Installer les dépendances en mode production
RUN npm ci --only=production && \
    npm cache clean --force

# Copier les fichiers source de l'application
COPY . .

# Exposer le port sur lequel votre application écoute
EXPOSE 3000

# Commande pour démarrer votre application
CMD ["npm", "start"]
