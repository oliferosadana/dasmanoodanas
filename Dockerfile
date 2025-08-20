# Use official Node.js LTS
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --omit=dev

# Copy source
# Create non-root user for security
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs

# Copy source code
COPY --chown=nodeuser:nodejs . .

# Env
ENV NODE_ENV=production
ENV PORT=3000

# Expose
EXPOSE 3000

# Start
USER nodeuser
CMD ["npm", "start"]
