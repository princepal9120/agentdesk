# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY libs/database/prisma ./libs/database/prisma/

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

# Build auth service
RUN npx @nestjs/cli build auth

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY libs/database/prisma ./libs/database/prisma/

# Install production dependencies
RUN npm ci --only=production --legacy-peer-deps

# Copy built application
COPY --from=builder /app/dist/apps/auth ./dist/apps/auth
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/apps/auth/main.js"]
