# Use official Node.js LTS
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* .npmrc* ./
RUN npm install --only=production

# Copy source
COPY . .

# Env
ENV NODE_ENV=production
ENV PORT=3000

# Expose
EXPOSE 3000

# Start
CMD ["npm", "start"]
