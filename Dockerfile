# syntax=docker/dockerfile:1
# ================================
# Stage 1: Builder
# ================================
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src/ ./src/
COPY public/ ./public/

# ================================
# Stage 2: Production
# ================================

FROM node:20-slim AS production

RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
  npm cache clean --force

COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar la aplicación
CMD ["node", "src/index.js"]