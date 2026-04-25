# syntax=docker/dockerfile:1.7
ARG BUN_VERSION=1-alpine

FROM oven/bun:${BUN_VERSION} AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun install --frozen-lockfile

RUN bun run build
RUN mkdir -p /app/public

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat openssl wget
# bun is required by the ArgoCD PreSync migration Job to run scripts/migrate.ts
RUN npm install -g bun@1.2.17
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Migration support — used by the ArgoCD PreSync migrate Job.
# `pg` and `drizzle-orm` are already traced into .next/standalone/node_modules
# because they are in dependencies and used by the app's runtime db client.
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/scripts/migrate.ts ./scripts/migrate.ts

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=5 \
  CMD wget -O- http://localhost:3000/api/health 2>&1 || exit 1

CMD ["node", "server.js"]
