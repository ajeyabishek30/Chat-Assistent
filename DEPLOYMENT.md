# Deployment Guide

## Quick Deployment Steps

### Frontend Deployment (Vercel - Recommended)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from frontend directory**:
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variable**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com`

### Frontend Deployment (Netlify)

1. **Connect Repository**:
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`

3. **Environment Variables**:
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com`

### Backend Deployment (Railway)

1. **Connect Repository**:
   - Go to Railway Dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure**:
   - Root directory: `backend`
   - Build command: (leave empty or `npm install`)
   - Start command: `npm start`

3. **Environment Variables**:
   - PORT will be auto-assigned
   - Update frontend `NEXT_PUBLIC_API_URL` with Railway URL

### Backend Deployment (Render)

1. **Create Web Service**:
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure**:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`

3. **Environment Variables**:
   - Add: `PORT` = `10000` (or leave auto-assigned)

### Backend Deployment (Heroku)

1. **Install Heroku CLI**:
   ```bash
   npm i -g heroku
   ```

2. **Create App**:
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

4. **Set Environment Variables** (if needed):
   ```bash
   heroku config:set PORT=5000
   ```

## Post-Deployment Checklist

- [ ] Backend is accessible and `/api/health` returns OK
- [ ] Frontend `NEXT_PUBLIC_API_URL` points to backend URL
- [ ] CORS is configured correctly on backend
- [ ] Test chat functionality on deployed site
- [ ] Verify localStorage works (chat history persists)

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure backend `server.js` has:
```javascript
app.use(cors());
```

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend logs for errors
- Ensure backend URL doesn't have trailing slash

### Build Errors
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Review build logs for specific errors

