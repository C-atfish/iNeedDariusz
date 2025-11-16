# -------- builder --------
    FROM node:lts-alpine AS builder

    WORKDIR /app
    
    # Install deps
    COPY package*.json ./
    RUN npm ci
    
    # Copy the rest of the app
    COPY . .
    
    # Build for production (Vite)
    # Make sure VITE_API_BASE is set appropriately in your env or Docker build args if needed
    RUN npm run build
    
    
    # -------- nginx --------
    FROM nginx:alpine
    
    WORKDIR /usr/share/nginx/html
    
    # Remove default nginx static contents
    RUN rm -rf ./*
    
    # Copy built assets from builder
    COPY --from=builder /app/dist ./
    
    # Optional: custom nginx config for SPA routing
    # (uncomment if you add nginx.conf in your frontend folder)
    # COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    