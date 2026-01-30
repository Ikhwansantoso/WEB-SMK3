# STAGE 1: Install Dependencies
FROM node:20-alpine AS deps
# TAMBAHKAN 'openssl' DI SINI
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package*.json ./
RUN npm ci

# STAGE 2: Build Aplikasi
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (Akan membaca binaryTargets baru)
RUN npx prisma generate

RUN npm run build

# STAGE 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# TAMBAHKAN 'openssl' JUGA DI SINI (Wajib untuk runtime)
RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir -p ./public/uploads
RUN chown nextjs:nodejs ./public/uploads

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]