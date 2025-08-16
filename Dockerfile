FROM node:18.19.1-alpine AS base
WORKDIR /app
# Disable telemetry to reduce data sent to Vercel
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# Cache dependencies to pnpm global store (doesn't install in node_modules)
RUN pnpm fetch --prefer-offline

FROM base AS builder
COPY --from=deps /root/.local/share/pnpm /root/.local/share/pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --offline
COPY . .
# Activate standalone build
ENV STANDALONE_BUILD=true
RUN pnpm build

FROM node:18.19.1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN apk add --no-cache libc6-compat
# -S to create a system user (no home and less privileges)
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]