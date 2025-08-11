# Utilise une image officielle légère de Node.js
FROM node:20-alpine

# Crée un dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances en premier
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code dans l'image
COPY . .

# Crée le dossier 'uploads' si besoin (surtout si fichiers statiques ou uploads d’images)
RUN mkdir -p /app/uploads

# Expose le port utilisé par l’application
EXPOSE 4545

# Lance le serveur
CMD ["node", "server.js"]
