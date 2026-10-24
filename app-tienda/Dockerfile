# ============================================================
# Dockerfile - App Tienda (front + API)
# ------------------------------------------------------------
# Imagen ligera basada en Node 20. Construye la app en un solo
# contenedor que sirve el front estatico y la API en el mismo puerto.
#
# Construir:   docker build -t app-tienda .
# Correr:      docker run -p 3000:3000 app-tienda
# ============================================================
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los manifiestos para aprovechar la cache de Docker.
COPY package*.json ./

# El script postinstall necesita este archivo durante npm install.
COPY datos/generar-datos.js ./datos/generar-datos.js

# Instalar dependencias y ejecutar postinstall.
RUN npm install --omit=dev

# Copiar el resto de la aplicacion.
COPY . .

# La app escucha en el puerto 3000 (configurable con la variable PORT).
ENV PORT=3000
EXPOSE 3000

# Healthcheck: Docker marca el contenedor "healthy" si la API responde.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Arrancar el servidor
CMD ["node", "servidor/server.js"]
