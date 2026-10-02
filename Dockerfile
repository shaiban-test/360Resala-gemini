# Production Dockerfile for Coolify Deployment
FROM node:22-alpine AS builder

WORKDIR /app

# Ensure devDependencies are installed during build
ENV NODE_ENV=development

# Install all dependencies with legacy peer deps to prevent ERESOLVE conflicts
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy application source and build frontend
COPY . .
RUN npm run build

# Production runner stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy resolved node_modules and built assets directly from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/index.html ./
COPY --from=builder /app/metadata.json ./
COPY --from=builder /app/tsconfig.json ./

# Install tsx globally for fast execution
RUN npm install -g tsx --legacy-peer-deps

EXPOSE 3000

# Start server
CMD ["tsx", "server.ts"]
