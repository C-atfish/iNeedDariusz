# -------- builder --------
    FROM node:lts-alpine AS builder
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    # VITE envs get inlined at build time from .env / .env.production
    RUN npm run build
    
    # -------- nginx --------
    FROM nginx:alpine
    WORKDIR /usr/share/nginx/html
    
    # Serve built assets
    COPY --from=builder /app/dist ./
    
    # Replace default config to add SPA fallback
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    