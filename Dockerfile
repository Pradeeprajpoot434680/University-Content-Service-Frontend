# ==========================================
# STAGE 1: Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (leveraging Docker layer caching)
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Vite React application for production (outputs to /app/dist)
RUN npm run build


# ==========================================
# STAGE 2: Production Stage with Nginx
# ==========================================
FROM nginx:1.25-alpine AS production

# Remove default static Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from the builder stage to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port (Nginx listens on 80 inside the container)
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]