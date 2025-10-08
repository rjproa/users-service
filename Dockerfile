# ================================
# Stage 1: Builder
# ================================
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (aprovecha cache de Docker)
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies)
# Necesario en caso de que alguna dependencia de producción requiera compilación
RUN npm ci

# Copiar el código fuente de la aplicación
# .dockerignore ya excluye tests/, .env, .git, etc.
COPY src/ ./src/
COPY public/ ./public/

# ================================
# Stage 2: Production
# ================================
FROM node:20-slim AS production

# Crear usuario no-root para seguridad
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar SOLO dependencias de producción
RUN npm ci --only=production && \
  npm cache clean --force

# Copiar código desde el stage builder con permisos correctos
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

# Cambiar al usuario no-root
USER nodejs

# Exponer puerto (valor por defecto, se puede sobrescribir con variable de entorno)
EXPOSE 3001

# Health check opcional (recomendado para producción)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar la aplicación
CMD ["node", "src/index.js"]