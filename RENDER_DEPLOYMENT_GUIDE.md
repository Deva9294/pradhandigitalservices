# Render Deployment Guide - Pradhan Digital Services

## Prerequisites

1. **GitHub Repository** - Your code should be pushed to GitHub
2. **Render Account** - Create account at [render.com](https://render.com)
3. **MongoDB Atlas** - For database (free tier available)
4. **Cloudinary Account** - For file uploads (free tier available)
5. **Razorpay Account** - For payments (test mode free)

---

## Step 1: Deploy Backend on Render

### 1.1 Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Whitelist IP: `0.0.0.0/0` (for Render)
5. Get connection string from Database > Connect > Connect your application
6. Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/pradhandigital?retryWrites=true&w=majority`

### 1.2 Deploy Backend Service

1. Go to Render Dashboard > New > Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `pradhan-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Free (or Starter)

4. Add Environment Variables in Render Dashboard:

```env
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pradhandigital?retryWrites=true&w=majority
JWT_SECRET=<your-32-char-secret>
FRONTEND_URL=https://your-frontend-url.onrender.com
RAZORPAY_KEY_ID=<your-key-id>
RAZORPAY_KEY_SECRET=<your-key-secret>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<your-app-password>
SMTP_FROM=noreply@pradhandigitalservices.in
SMTP_FROM_NAME=Pradhan Digital Services
API_KEY=<your-api-key>
```

5. Click **Deploy Web Service**
6. Wait for deployment to complete (2-5 minutes)
7. Copy the backend URL: `https://pradhan-backend.onrender.com`

---

## Step 2: Deploy Frontend on Render

### 2.1 Deploy Frontend Service

1. Go to Render Dashboard > New > Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `pradhan-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Free (or Starter)

4. Add Environment Variables in Render Dashboard:

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://pradhan-frontend.onrender.com
NEXT_PUBLIC_API_URL=https://pradhan-backend.onrender.com/api
NEXT_PUBLIC_API_ORIGIN=https://pradhan-backend.onrender.com
NEXT_PUBLIC_WHATSAPP=919294899787
NEXT_PUBLIC_SUPPORT_NUMBER=+91 9294899787
NEXT_PUBLIC_SUPPORT_EMAIL=support@pradhandigitalservices.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=<your-razorpay-key-id>
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_YOUTUBE_URL=
NEXT_PUBLIC_TWITTER_URL=
```

5. Click **Deploy Web Service**
6. Wait for deployment to complete (3-5 minutes)
7. Copy the frontend URL: `https://pradhan-frontend.onrender.com`

---

## Step 3: Update Backend CORS

After backend is deployed, update the `FRONTEND_URL` environment variable in Render backend dashboard:

```env
FRONTEND_URL=https://pradhan-frontend.onrender.com
```

This will allow the frontend to communicate with the backend.

---

## Step 4: Verify Deployment

### 4.1 Check Backend Health

Open in browser:
```
https://pradhan-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Pradhan Digital Services API is running"
}
```

### 4.2 Check Frontend

Open in browser:
```
https://pradhan-frontend.onrender.com
```

- Check if homepage loads
- Check if navigation works
- Check if services page loads
- Check if contact form works

### 4.3 Test API Connection

Try to register/login from the frontend and verify it works.

---

## Step 5: Configure Custom Domain (Optional)

### 5.1 For Frontend

1. Go to frontend service in Render
2. Settings > Custom Domains
3. Add your domain: `pradhandigitalservices.com`
4. Update DNS records as shown in Render

### 5.2 For Backend

1. Go to backend service in Render
2. Settings > Custom Domains
3. Add subdomain: `api.pradhandigitalservices.com`
4. Update DNS records as shown in Render

### 5.3 Update Environment Variables

After custom domains are configured, update:

**Backend FRONTEND_URL:**
```env
FRONTEND_URL=https://pradhandigitalservices.com
```

**Frontend NEXT_PUBLIC_API_URL:**
```env
NEXT_PUBLIC_API_URL=https://api.pradhandigitalservices.com/api
NEXT_PUBLIC_API_ORIGIN=https://api.pradhandigitalservices.com
NEXT_PUBLIC_SITE_URL=https://pradhandigitalservices.com
```

---

## Step 6: Configure Webhooks

### Razorpay Webhook

1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add webhook URL: `https://pradhan-backend.onrender.com/api/payments/webhook/razorpay`
3. Generate webhook secret
4. Add `RAZORPAY_WEBHOOK_SECRET` to backend environment variables

---

## Common Issues & Solutions

### Issue 1: Backend fails to start

**Solution:**
- Check Render logs for errors
- Verify MongoDB URI is correct
- Verify JWT_SECRET is at least 32 characters
- Check if all environment variables are set

### Issue 2: Frontend cannot connect to backend

**Solution:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS settings (FRONTEND_URL)
- Check if backend is running (health endpoint)
- Check Render logs for errors

### Issue 3: Build fails

**Solution:**
- Check Node.js version compatibility
- Clear cache and redeploy
- Check for missing dependencies
- Verify build command is correct

### Issue 4: Database connection fails

**Solution:**
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Verify database user credentials
- Check MongoDB cluster status

---

## Monitoring

### View Logs

1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. View real-time logs

### View Metrics

1. Go to Render Dashboard
2. Select your service
3. Click "Metrics" tab
4. View CPU, memory, and response time

---

## Cost Estimation (Render)

### Free Tier (Limited)
- **Backend**: Free (750 hours/month)
- **Frontend**: Free (750 hours/month)
- **Database**: MongoDB Atlas Free (512MB)
- **Total**: $0/month

### Starter Tier (Recommended)
- **Backend**: $7/month
- **Frontend**: $7/month
- **Database**: MongoDB Atlas Free or $57/month (2GB)
- **Total**: ~$14-71/month

---

## Backup Strategy

### MongoDB Atlas Backups

1. Go to MongoDB Atlas
2. Cluster > Backup
3. Enable automated backups
4. Set retention: 7-30 days

### Manual Backup

```bash
mongodump --uri MONGODB_URI --out ./backup
```

---

## Security Checklist

- [ ] All environment variables set in Render
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] MongoDB IP whitelist configured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] HTTPS enabled (automatic on Render)
- [ ] Database authentication enabled
- [ ] API keys and secrets not exposed
- [ ] Webhook secrets configured
- [ ] Custom domain with SSL configured

---

## Support

For deployment issues:
- Check Render documentation: https://render.com/docs
- Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com
- Contact: support@pradhandigitalservices.in

---

**Last Updated:** 2026-10-18
