# Build React application
FROM node:22-alpine AS builder

WORKDIR /app

# Build-time API URL
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=${VITE_API_URL}

# Install dependencies first (better Docker cache)
COPY package.json package-lock.json ./

RUN npm ci

# Copy source
COPY . .

# Build production bundle
RUN npm run build


# Production runtime
FROM nginx:1.27-alpine

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK \
    --interval=30s \
    --timeout=5s \
    --start-period=15s \
    --retries=3 \
    CMD wget --spider --quiet http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]