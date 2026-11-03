# Node 22.23.4 (Jod LTS security release with the Brotli fix, CVE-2026-111497), pinned by digest.
# No secrets at build time: runtime env (including secrets) comes from the platform only.
FROM node:22.23.4-bookworm-slim@sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js ./
USER node
EXPOSE 8080
CMD ["node", "server.js"]
