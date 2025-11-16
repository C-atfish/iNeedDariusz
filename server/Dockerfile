# -------------------------
# 1) Builder stage
# -------------------------
    FROM node:lts-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    COPY prisma ./prisma
    RUN npm install
    
    COPY tsconfig.json ./
    COPY src ./src
    
    # Generate Prisma client (goes to ./generated/prisma per your schema)
    RUN npx prisma generate
    
    # Build TS → dist
    RUN npm run build
    
    
    # -------------------------
    # 2) Production stage
    # -------------------------
    FROM node:lts-alpine
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    # Install only production deps
    COPY package*.json ./
    RUN npm install --omit=dev
    
    # Copy prisma folder because Prisma needs schema + migrations
    COPY prisma ./prisma
    
    # 👇 Copy built JS
    COPY --from=builder /app/dist ./dist
    
    # 👇 Copy generated Prisma client + engines
    COPY --from=builder /app/generated ./generated
    
    # (You *probably* don't need this if you already installed deps above,
    # but if you want to keep it, it's OK. I'd actually remove it.)
    # COPY --from=builder /app/node_modules ./node_modules
    
    EXPOSE 3001
    
    CMD ["node", "dist/src/server.js"]
    