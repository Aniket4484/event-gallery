# 🚀 WeddingSnaps - Deployment & Production Setup

**Get your gallery live and running!**

---

## 📋 Pre-Deployment Checklist

Before launching to production, ensure:

- [ ] Database configured (PostgreSQL recommended)
- [ ] Cloudinary account created & API keys ready
- [ ] NEXTAUTH_SECRET generated
- [ ] NEXTAUTH_URL set to your domain
- [ ] SMTP credentials (optional, for emails)
- [ ] Domain name purchased
- [ ] SSL certificate ready
- [ ] Backups configured
- [ ] Analytics set up
- [ ] Performance tested

---

## 🗄️ Database Setup (Production)

### Option A: PostgreSQL (Recommended for Production)

#### 1. Install PostgreSQL
**Windows:**
```bash
# Using Chocolatey
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### 2. Create Database & User
```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE USER weddingsnaps WITH PASSWORD 'strong_password_here';
CREATE DATABASE weddingsnaps OWNER weddingsnaps;
GRANT ALL PRIVILEGES ON DATABASE weddingsnaps TO weddingsnaps;
\q
```

#### 3. Update .env
```bash
DATABASE_URL="postgresql://weddingsnaps:strong_password_here@localhost:5432/weddingsnaps"
```

#### 4. Push Schema
```bash
npx prisma migrate deploy
# or
npm run db:push
```

#### 5. Verify Connection
```bash
npm run db:studio
# Should open Prisma Studio with your data
```

### Option B: Managed PostgreSQL (Recommended for Easier Management)

#### Services:
- **Vercel Postgres** (best for Vercel deployment)
- **Amazon RDS**
- **DigitalOcean Managed Databases**
- **Heroku Postgres**

#### Setup Example (Vercel Postgres):
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Create Postgres database
vercel postgres create

# Get connection string from Vercel dashboard
# Add to .env
DATABASE_URL="..."

# Push schema
npm run db:push
```

---

## ☁️ Cloudinary Setup

### 1. Create Account
Visit: https://cloudinary.com → Sign Up → Free tier available

### 2. Get API Credentials
1. Go to Dashboard
2. Look for "API Keys" section
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

### 3. Configure Folders (Optional)
In Cloudinary Dashboard:
1. Settings → Upload
2. Add upload preset: `wedding_photos`
3. Set default folder: `wedding-snaps`

### 4. Update .env
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 5. Test Upload
```bash
npm run dev
# Try uploading a photo in admin dashboard
```

---

## 🔐 Security Configuration

### Generate NEXTAUTH_SECRET
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Copy the generated secret to .env
NEXTAUTH_SECRET="your-generated-secret-here"
```

### Environment Variables - Complete List
```bash
# === Database ===
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# === NextAuth ===
NEXTAUTH_SECRET="your-secret-key-32-chars-minimum"
NEXTAUTH_URL="https://yourdomain.com"  # Must match your domain!

# === Cloudinary ===
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# === Email (Optional) ===
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# === Optional ===
NEXT_PUBLIC_ENVIRONMENT="production"
ANALYTICS_ID="your-analytics-id"  # For Google Analytics, etc.
```

---

## 🌐 Deployment Options

### Option 1: Vercel (EASIEST - Recommended)

**Why Vercel?**
- Built for Next.js (zero config)
- Automatic deployments
- Edge functions
- Built-in analytics
- Free tier available

#### Steps:

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/weddingsnaps.git
git push -u origin main
```

2. **Connect Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import GitHub repository
- Select your repo

3. **Set Environment Variables**
- In Vercel Project Settings → Environment Variables
- Add all variables from `.env`

4. **Database Setup**
- Create Postgres in Vercel → Storage
- Copy connection string
- Add as DATABASE_URL

5. **Deploy**
- Vercel auto-deploys on `git push`
- View at: `https://yourproject.vercel.app`

#### Add Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Follow DNS instructions
4. Wait 5-10 minutes for propagation

### Option 2: Docker + Cloud Hosting

#### Create Dockerfile
```dockerfile
# Use Node.js LTS
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build app
RUN npm run build

# Set environment for production
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
```

#### Deploy to AWS EC2
```bash
# 1. SSH into instance
ssh -i key.pem ec2-user@your-instance-ip

# 2. Install Docker
sudo yum install docker
sudo systemctl start docker

# 3. Clone repo
git clone https://github.com/yourusername/weddingsnaps.git
cd weddingsnaps

# 4. Create .env file
sudo nano .env
# Paste all environment variables

# 5. Build & run
docker build -t weddingsnaps .
docker run -d -p 80:3000 --env-file .env weddingsnaps

# 6. Check logs
docker logs <container-id>
```

#### Deploy to DigitalOcean (App Platform)
1. Push code to GitHub
2. DigitalOcean → Create App
3. Connect GitHub repository
4. Set environment variables
5. Deploy (auto-builds Docker image)
6. Add domain → DNS pointing

### Option 3: Traditional Server (cPanel, Shared Hosting)

**Recommended hosting with Node.js support:**
- Kinsta
- Reclaim Hosting
- A2 Hosting
- GreenGeeks

#### Manual Setup
```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone & setup
git clone https://github.com/yourusername/weddingsnaps.git
cd weddingsnaps
npm install
npm run build

# 4. Create .env
nano .env
# Add all variables

# 5. Use PM2 for process management
npm install -g pm2
pm2 start npm --name weddingsnaps -- start
pm2 save
pm2 startup

# 6. Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/weddingsnaps
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 SSL/HTTPS Setup

### Option 1: Automatic (Vercel)
- ✅ Automatic for all Vercel domains
- ✅ HTTPS by default
- ✅ Auto-renewing

### Option 2: Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo certbot renew --dry-run
sudo systemctl enable certbot.timer
```

### Option 3: Commercial SSL
- DigiCert, GlobalSign, etc.
- Usually auto-installed by hosting provider

---

## 📊 Post-Deployment Checklist

After deployment, verify:

- [ ] **Website loads** → Visit your domain
- [ ] **Admin login works** → Login with test account
- [ ] **Photo upload works** → Try uploading a photo
- [ ] **Gallery loads** → Visit `/gallery/testcode`
- [ ] **Download works** → Test download request
- [ ] **Theme toggle works** → Switch light/dark
- [ ] **Mobile responsive** → Test on phone
- [ ] **Performance good** → Check Lighthouse score
- [ ] **HTTPS working** → Check for green lock
- [ ] **Analytics firing** → Check analytics dashboard
- [ ] **Backups enabled** → Verify database backups
- [ ] **Emails sending** → Test download email (if configured)
- [ ] **Error handling** → Check error pages
- [ ] **SEO tags** → Check page titles/meta
- [ ] **Logging enabled** → Check production logs

---

## 📈 Performance Optimization

### Cloudinary Settings
```javascript
// Optimize image delivery
const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/
  q_auto,                 // Auto quality optimization
  f_auto,                 // Auto format (WebP, etc.)
  w_${width},            // Responsive width
  c_limit                // Constrain dimensions
  /v${version}/${publicId}.jpg`;
```

### Database Optimization
```bash
# Add indexes for faster queries
npx prisma migrate dev --name add_indexes
```

### Caching Strategy
```
Cache-Control: max-age=31536000  # Images (1 year)
Cache-Control: max-age=3600      # API responses (1 hour)
Cache-Control: no-cache          # HTML (revalidate)
```

---

## 📥 Backup & Recovery

### Database Backups

**PostgreSQL Automatic Backup:**
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/home/backups"
DB_NAME="weddingsnaps"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump -U weddingsnaps $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Keep last 30 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete

# Cron job: Add to crontab
# 0 2 * * * /home/backup.sh  # Daily at 2 AM
```

**Using Managed Services:**
- Vercel Postgres → Auto-backups
- AWS RDS → Point-in-time restore
- DigitalOcean → Automated backups

### Image Backups (Cloudinary)
- All images auto-backed up by Cloudinary
- Versioning available
- Easy restore

### Disaster Recovery Plan
1. **Database issue?** → Restore from backup
2. **Site down?** → Switch to backup server
3. **Data loss?** → Recover from Cloudinary
4. **Hacked?** → Restore clean backup + security audit

---

## 🔧 Monitoring & Maintenance

### Setup Monitoring
```bash
# Sentry for error tracking
npm install @sentry/nextjs

# Configure in next.config.js
import * as Sentry from "@sentry/nextjs";
Sentry.init({ dsn: "your-sentry-dsn" });
```

### Health Checks
```bash
# Monitor uptime
curl https://yourdomain.com/api/health

# Setup cron job
*/5 * * * * curl -f https://yourdomain.com || alert-admin
```

### Logs Management
```bash
# View production logs
pm2 logs weddingsnaps

# Or use logging service
# LogRocket, Datadog, New Relic
```

### Regular Maintenance
- [ ] Weekly: Check error logs
- [ ] Monthly: Database optimization
- [ ] Monthly: Security updates
- [ ] Quarterly: Performance audit
- [ ] Yearly: Security penetration test

---

## 🚨 Troubleshooting Deployment

### Issue: Database connection fails
```bash
# Check DATABASE_URL format
# PostgreSQL: postgresql://user:pass@host:port/dbname
# Verify credentials
psql -U user -h host -d dbname

# If still failing, check firewall/network
```

### Issue: Cloudinary upload fails
```bash
# Verify credentials
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="correct-name"
CLOUDINARY_API_KEY="correct-key"
CLOUDINARY_API_SECRET="correct-secret"

# Test upload manually
curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@image.jpg" \
  -F "api_key=YOUR_KEY"
```

### Issue: HTTPS not working
```bash
# For Vercel: Settings → Domains → Force HTTPS ✓
# For custom: Ensure cert is installed
sudo certbot certificates
# Restart web server
sudo systemctl restart nginx
```

### Issue: Site too slow
```bash
# Check performance
# 1. Lighthouse audit (DevTools)
# 2. Vercel Analytics dashboard
# 3. Database query optimization
npx prisma client --generator-performance

# 4. Image optimization in Cloudinary
# 5. Redis caching layer (advanced)
```

---

## 📞 Support Contacts

### Emergency Issues
1. Check logs: `npm run logs` or hosting dashboard
2. Review this guide's troubleshooting section
3. Check project README & documentation

### Common Resources
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

## 🎉 You're Live!

Congratulations! Your WeddingSnaps gallery is now live and ready to share beautiful wedding moments.

**Key Takeaways:**
- ✅ Database configured & secured
- ✅ Images hosted on Cloudinary CDN
- ✅ Site deployed & accessible globally
- ✅ HTTPS enabled & secure
- ✅ Backups automated
- ✅ Monitoring in place

**Next Steps:**
1. Invite photographers/clients
2. Create first wedding gallery
3. Upload sample photos
4. Share with guests
5. Monitor analytics & feedback

---

## 📊 Recommended Production Specs

### Minimum
- **Server**: 1 vCPU, 2GB RAM, 20GB SSD
- **Database**: PostgreSQL 12+
- **CDN**: Cloudinary or similar
- **Bandwidth**: 100GB/month

### Recommended
- **Server**: 2 vCPU, 4GB RAM, 50GB SSD
- **Database**: PostgreSQL 14+, High availability
- **CDN**: Cloudinary Pro
- **Bandwidth**: Unlimited
- **Cache**: Redis layer
- **Monitoring**: Sentry + DataDog

### Enterprise
- **Server**: Auto-scaling (2-4 vCPU)
- **Database**: PostgreSQL multi-node cluster
- **CDN**: Cloudinary Enterprise + Akamai
- **Cache**: Redis cluster
- **Monitoring**: Full suite + 24/7 alerts
- **Backup**: Multi-region replication

---

**Version**: 1.0.0  
**Last Updated**: June 24, 2025  
**Status**: Production Ready ✅

🪷 **Ready to Launch!** 🪷
