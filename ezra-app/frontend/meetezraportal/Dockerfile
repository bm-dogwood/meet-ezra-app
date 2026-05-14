FROM node:20-slim AS builder
WORKDIR /app

# Build args for config (passed from CI/CD or deploy script)
ARG NEXT_PUBLIC_API_URL

# Set env vars from build args
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit || npm install --prefer-offline --no-audit

# Copy all source files
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5177
ENV HOSTNAME=0.0.0.0

# Copy built assets from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 5177

CMD ["node", "server.js"]
