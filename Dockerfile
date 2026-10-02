# Production Dockerfile for Coolify Deployment
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files and build
COPY . .
RUN npm run build

# Production runner stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies and tsx for TypeScript server execution
COPY package*.json ./
RUN npm install --omit=dev && npm install -g tsx

# Copy built assets and server code
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/index.html ./
COPY --from=builder /app/metadata.json ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

# Run production server
CMD ["npx", "tsx", "server.ts"]
