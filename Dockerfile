# ===========================
# Builder stage
# ===========================
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN npm install -g yarn

WORKDIR /app

# Disable Husky during builds
ENV HUSKY=0

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy full source code
COPY . .

# Build the Next.js app
RUN yarn build

# ===========================
# Runner stage
# ===========================
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
RUN npm install -g yarn

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy build output and public assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

# Start Next.js server
CMD ["yarn", "start"]
