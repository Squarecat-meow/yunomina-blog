# syntax=docker.io/docker/dockerfile:1

FROM node:22-bookworm AS base

# libc-compat 설치
FROM base AS deps
WORKDIR /app

# 디펜던시 설치
COPY package.json package-lock.json* ./
RUN npm ci

# 소스코드 빌드하는 곳
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# NODE.ENV 프로덕션으로 변경
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# 텔레메트리 안 보내기
ENV NEXT_TELEMETRY_DISABLED=1

# 유저그룹 & 유저 추가
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts .
COPY --chown=nextjs:nodejs package.json .
COPY --chown=nextjs:nodejs package-lock.json .
COPY --chown=nextjs:nodejs prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "start:docker"]