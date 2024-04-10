# Utiliser l'image de base officielle Node.js
FROM node:latest

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de l'application vers le répertoire de travail
COPY package.json package-lock.json /app/
COPY ./src ./public /app/

# Installer les dépendances de l'application
RUN npm install

# Exposer le port sur lequel votre application écoute
EXPOSE 3000

# Commande pour démarrer votre application
CMD ["npm", "start"]
