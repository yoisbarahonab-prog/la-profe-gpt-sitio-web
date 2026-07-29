FROM node:20-alpine

WORKDIR /app

# Copiar definiciones de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalación limpia de dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer puertos de Angular Dev Server (4200) y Netlify Functions (8888)
EXPOSE 4200 8888

# Comando por defecto con host 0.0.0.0 y polling para Hot Reload
CMD ["npm", "start"]
