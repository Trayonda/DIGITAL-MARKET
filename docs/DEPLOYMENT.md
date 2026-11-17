# DIGITAL MARKET - DEPLOYMENT & HOSTING GUIDE

This guide provides instructions to deploy DIGITAL MARKET (Used & Refurbished Laptop & PC Platform) to production.

---

## 1. Hosting Architecture Overview

| Tier | Recommended Services | Alternative Services |
| :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | Hostinger VPS, Cloudflare Pages |
| **Backend** | [Render](https://render.com) or [Railway](https://railway.app) | AWS EC2, DigitalOcean Droplet, VPS |
| **Database** | [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com) | Managed PostgreSQL (Render/Railway) |
| **Media Storage** | [Cloudinary](https://cloudinary.com) | AWS S3, Cloudflare R2, Local Disk |

---

## 2. PostgreSQL Database Setup (Neon or Supabase)

1. Create a free account on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
2. Create a new PostgreSQL database (e.g. `digital_market_prod`).
3. Copy your Connection String:
   ```env
   DATABASE_URL="postgresql://username:password@ep-sample-pooler.us-east-2.aws.neon.tech/digital_market_prod?sslmode=require"
   ```
4. In `backend/prisma/`:
   Switch the schema to PostgreSQL:
   ```bash
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

---

## 3. Backend Deployment (Render or Railway)

1. Push your monorepo to GitHub.
2. Create a **New Web Service** on Render/Railway:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build && npx prisma generate`
   - Start Command: `npm start`
3. Add Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: *(Your PostgreSQL URL)*
   - `JWT_SECRET`: *(A random 64-character secret)*
   - `FRONTEND_URL`: `https://your-store.vercel.app`
   - `CLOUDINARY_CLOUD_NAME`: *(From Cloudinary dashboard)*
   - `CLOUDINARY_API_KEY`: *(From Cloudinary dashboard)*
   - `CLOUDINARY_API_SECRET`: *(From Cloudinary dashboard)*

---

## 4. Frontend Deployment (Vercel or Netlify)

1. Connect your repository to Vercel/Netlify.
2. Select Framework: **Vite**
3. Configure settings:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set Environment Variables:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`

---

## 5. Hostinger / cPanel / Shared VPS Migration (Future Expansion)

If migrating to Hostinger or GoDaddy VPS:
1. Ensure the VPS has **Node.js (v18+)** and **PostgreSQL (v14+)** installed.
2. Use **PM2** to manage the Node.js process:
   ```bash
   npm install -g pm2
   cd backend
   npm run build
   pm2 start dist/server.js --name "digital-market-api"
   pm2 save
   pm2 startup
   ```
3. Set up **Nginx** reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name digitalmarket.in www.digitalmarket.in;

       location /api/ {
           proxy_pass http://localhost:5000/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location / {
           root /var/www/digitalmarket/frontend/dist;
           try_files $uri $uri/ /index.html;
       }
   }
   ```
4. Install free SSL via Certbot:
   ```bash
   sudo certbot --nginx -d digitalmarket.in -d www.digitalmarket.in
   ```
