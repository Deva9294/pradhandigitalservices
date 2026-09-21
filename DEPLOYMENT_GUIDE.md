# Pradhan Digital Services - Deployment Guide

**Version:** 1.0  
**Last Updated:** 2026-09-19

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Setup](#database-setup)
6. [Environment Variables](#environment-variables)
7. [Third-Party Integrations](#third-party-integrations)
8. [Security Configuration](#security-configuration)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **MongoDB**: >= 6.x
- **Git**: Latest version

### Required Accounts

- MongoDB Atlas account (for cloud database)
- Cloudinary account (for file storage)
- Razorpay account (for payments)
- Email service (SendGrid/Mailgun) account
- SMS service account (optional)
- Domain name and DNS provider

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pradhandigitalservices
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Create Environment Files

#### Backend Environment (.env)

```env
# Server
NODE_ENV=production
PORT=8000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pradhandigital?retryWrites=true&w=majority

# JWT
JWT_SECRET=<your-super-secret-key-min-32-chars>

# Frontend URL
FRONTEND_URL=https://pradhandigitalservices.in

# Razorpay
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<your-app-password>
SMTP_FROM=noreply@pradhandigitalservices.in
SMTP_FROM_NAME=Pradhan Digital Services

# SMS (Optional)
SMS_PROVIDER=twilio
SMS_API_KEY=<your-api-key>
SMS_SENDER_ID=<your-sender-id>

# API Security
API_KEY=<your-api-key-for-internal-apis>
```

#### Frontend Environment (.env.local)

```env
NEXT_PUBLIC_SITE_URL=https://pradhandigitalservices.in
NEXT_PUBLIC_API_URL=https://api.pradhandigitalservices.in/api
NEXT_PUBLIC_WHATSAPP=919294899787
NEXT_PUBLIC_SUPPORT_NUMBER=+91 9294899787
NEXT_PUBLIC_RAZORPAY_KEY_ID=<your-razorpay-key-id>
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   cd frontend
   npx vercel
   ```

2. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**
   Add all frontend environment variables in Vercel dashboard

4. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Option 2: Netlify

1. **Build the Project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect Netlify to GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variables

### Option 3: VPS/Dedicated Server

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install PM2**
   ```bash
   npm install -g pm2
   ```

3. **Build and Start**
   ```bash
   cd frontend
   npm run build
   pm2 start npm --name "pds-frontend" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name pradhandigitalservices.in;

       location / {
           proxy_pass http://localhost:3002;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Backend Deployment

### Option 1: Render (Recommended)

1. **Create Render Account**
   - Go to render.com
   - Create new Web Service

2. **Configure**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free or paid tier

3. **Add Environment Variables**
   Add all backend environment variables

4. **Deploy**
   - Connect to GitHub repository
   - Auto-deploy on push

### Option 2: Railway

1. **Create Railway Account**
   - Go to railway.app
   - Create new project

2. **Add Services**
   - Add MongoDB service
   - Add backend service

3. **Configure**
   - Set environment variables
   - Configure build and start commands

### Option 3: VPS/Dedicated Server

1. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm mongodb
   ```

2. **Setup MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   npm install
   pm2 start npm --name "pds-backend" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx for Backend**
   ```nginx
   server {
       listen 80;
       server_name api.pradhandigitalservices.in;

       location / {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /uploads {
           alias /path/to/backend/uploads;
       }
   }
   ```

---

## Database Setup

### MongoDB Atlas (Cloud)

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create free tier cluster
   - Set up database user

2. **Whitelist IP**
   - Add 0.0.0.0/0 for development
   - Add specific IPs for production

3. **Get Connection String**
   - Copy connection string
   - Add to environment variables

### Local MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt install -y mongodb

   # macOS
   brew install mongodb-community

   # Windows
   # Download from mongodb.com
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Configure Environment**
   ```env
   MONGODB_URI=mongodb://localhost:27017/pradhandigital
   ```

---

## Environment Variables

### Production Checklist

- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` configured
- [ ] `JWT_SECRET` set (32+ characters)
- [ ] `FRONTEND_URL` set to production URL
- [ ] `RAZORPAY_KEY_ID` configured
- [ ] `RAZORPAY_KEY_SECRET` configured
- [ ] `CLOUDINARY_CLOUD_NAME` configured
- [ ] `CLOUDINARY_API_KEY` configured
- [ ] `CLOUDINARY_API_SECRET` configured
- [ ] `SMTP_HOST` configured
- [ ] `SMTP_USER` configured
- [ ] `SMTP_PASS` configured
- [ ] `API_KEY` configured

---

## Third-Party Integrations

### Razorpay (Payments)

1. **Create Account**
   - Go to razorpay.com
   - Create account and verify KYC

2. **Get API Keys**
   - Navigate to Settings > API Keys
   - Generate Key ID and Key Secret

3. **Configure Webhook**
   - Set webhook URL: `https://api.pradhandigitalservices.in/api/payments/webhook/razorpay`
   - Generate webhook secret

4. **Update Environment Variables**
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=test_secret_xxxxx
   RAZORPAY_WEBHOOK_SECRET=webhook_secret_xxxxx
   ```

### Cloudinary (File Storage)

1. **Create Account**
   - Go to cloudinary.com
   - Create free tier account

2. **Configure Upload Presets**
   - Create unsigned upload preset for development
   - Create signed upload preset for production

3. **Get API Credentials**
   - Navigate to Dashboard
   - Copy Cloud Name, API Key, and API Secret

4. **Update Environment Variables**
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### SendGrid (Email)

1. **Create Account**
   - Go to sendgrid.com
   - Create free tier account

2. **Verify Sender**
   - Add sender email and verify SPF/DKIM

3. **Get API Key**
   - Navigate to Settings > API Keys
   - Generate API key

4. **Update Environment Variables**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.xxxxx
   SMTP_FROM=noreply@pradhandigitalservices.in
   ```

---

## Security Configuration

### 1. Enable HTTPS

**Let's Encrypt (Free SSL)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d pradhandigitalservices.in
```

### 2. Configure Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Set Up Fail2Ban

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. Configure MongoDB Authentication

```javascript
// In connection string
MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin
```

### 5. Enable MongoDB IP Whitelist

- Only allow specific IPs in MongoDB Atlas
- Use VPN for database access

---

## Monitoring and Maintenance

### 1. Application Monitoring

**PM2 Monitoring**
```bash
pm2 monit
pm2 logs pds-backend
pm2 logs pds-frontend
```

**Uptime Monitoring**
- Use UptimeRobot (free)
- Monitor frontend, backend, and database

### 2. Log Management

**PM2 Log Rotation**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. Database Backups

**MongoDB Atlas Automated Backups**
- Enable in Atlas dashboard
- Set retention period (7-30 days)
- Configure backup frequency

**Manual Backup**
```bash
mongodump --uri MONGODB_URI --out /backup/path
```

### 4. SSL Certificate Renewal

**Let's Certbot Auto-Renewal**
```bash
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Problem:** Backend cannot connect to MongoDB

**Solution:**
- Check MongoDB URI is correct
- Verify IP is whitelisted in MongoDB Atlas
- Check network connectivity
- Verify MongoDB service is running

#### 2. Payment Webhook Not Working

**Problem:** Razorpay webhooks not receiving

**Solution:**
- Verify webhook URL is accessible
- Check webhook secret matches
- Verify firewall allows Razorpay IPs
- Check webhook signature verification

#### 3. File Upload Failing

**Problem:** Cloudinary upload failing

**Solution:**
- Verify API credentials
- Check upload preset configuration
- Verify file size limits
- Check network connectivity

#### 4. Email Not Sending

**Problem:** Nodemailer not sending emails

**Solution:**
- Verify SMTP credentials
- Check if using app password (Gmail)
- Verify SPF/DKIM records
- Check email service status

#### 5. Build Failing

**Problem:** Frontend build failing

**Solution:**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Check for syntax errors

---

## Performance Optimization

### 1. Enable Compression

**Nginx Configuration**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. Enable Caching

**Nginx Static File Caching**
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Indexing

Ensure all models have proper indexes defined.

### 4. CDN for Static Assets

- Use Cloudflare CDN
- Configure to cache static assets
- Enable Brotli compression

---

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**
   - Use Nginx as load balancer
   - Distribute traffic across multiple instances

2. **Database Scaling**
   - Use MongoDB Atlas for automatic scaling
   - Enable sharding for large datasets

3. **Redis for Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data

### Vertical Scaling

1. **Increase Server Resources**
   - More CPU cores
   - More RAM
   - Faster storage (SSD)

2. **Optimize Application**
   - Enable code splitting
   - Implement lazy loading
   - Optimize database queries

---

## Cost Estimation

### Minimum Viable Setup (Monthly)

- **VPS:** $5-10 (DigitalOcean/Linode)
- **MongoDB Atlas:** Free tier (512MB)
- **Cloudinary:** Free tier (25GB)
- **SendGrid:** Free tier (100/day)
- **Domain:** $10-15/year
- **SSL:** Free (Let's Encrypt)

**Total:** ~$10-15/month

### Recommended Setup (Monthly)

- **VPS:** $20-40 (better performance)
- **MongoDB Atlas:** $57 (2GB RAM)
- **Cloudinary:** $99 (Pro tier)
- **SendGrid:** $20 (Basic)
- **Domain:** $10-15/year
- **Monitoring:** $10 (UptimeRobot Pro)

**Total:** ~$100-150/month

---

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] HTTPS enabled with valid SSL
- [ ] Database connected and accessible
- [ ] Payment gateway webhooks configured
- [ ] File upload working
- [ ] Email sending working
- [ ] SMS service configured (if used)
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Logging and monitoring set up
- [ ] Backup strategy in place
- [ ] SSL auto-renewal configured
- [ ] Firewall rules configured
- [ ] Domain DNS properly configured
- [ ] Application tested end-to-end
- [ ] Error pages (404, 500) working
- [ ] PWA manifest and service worker working
- [ ] SEO meta tags and sitemap generated
- [ ] Accessibility tested
- [ ] Mobile responsiveness tested
- [ ] Performance tested (Lighthouse)

---

## Support and Maintenance

### Regular Maintenance Tasks

**Daily:**
- Monitor application logs
- Check error rates
- Verify payment processing

**Weekly:**
- Review security logs
- Check database performance
- Verify backup completion

**Monthly:**
- Review and update dependencies
- Audit user accounts
- Review payment reconciliation
- Update SSL certificates (if not auto-renewed)

**Quarterly:**
- Security audit
- Performance review
- Cost optimization
- Disaster recovery testing

---

## Emergency Procedures

### 1. Database Failure

**Immediate Actions:**
- Switch to read-only mode
- Notify users via maintenance page
- Restore from latest backup
- Investigate root cause

### 2. Payment Gateway Outage

**Immediate Actions:**
- Disable payment processing
- Show maintenance message
- Enable manual payment processing
- Notify users via email

### 3. Security Breach

**Immediate Actions:**
- Disable all API access
- Change all API keys and secrets
- Force password reset for all users
- Enable 2FA for admin accounts
- Conduct security audit
- Notify affected users

---

## Contact

For deployment support, contact:
- **Email:** support@pradhandigitalservices.in
- **Phone:** +91 9294899787
- **WhatsApp:** +91 9294899787

---

**Last Updated:** 2026-09-19  
**Version:** 1.0