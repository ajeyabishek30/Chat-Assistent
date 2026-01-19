# 🚀 Quick Deployment Guide

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/project/chat-assistant-6112c/settings/general)
2. Scroll down to "Your apps" section
3. If no web app exists, click "Add app" and select Web (</>) 
4. Copy the Firebase configuration object

## Step 2: Configure Environment Variables

Edit `frontend/.env.local` and add your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=chat-assistant-6112c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=chat-assistant-6112c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=chat-assistant-6112c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-chat-assistant-6112c.cloudfunctions.net
```

## Step 3: Login to Firebase

```bash
firebase login
```

## Step 4: Deploy Everything

```bash
# Deploy backend functions and Firestore rules
firebase deploy --only functions,firestore

# Build and deploy frontend
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

Or deploy everything at once:
```bash
npm run deploy:all
```

## Step 5: Access Your App

Your app will be live at:
- **Primary URL**: https://chat-assistant-6112c.web.app
- **Alternative URL**: https://chat-assistant-6112c.firebaseapp.com

## 🔥 Functions Deployed

After deployment, your backend APIs will be available at:

```
https://us-central1-chat-assistant-6112c.cloudfunctions.net/chat
https://us-central1-chat-assistant-6112c.cloudfunctions.net/saveChat
https://us-central1-chat-assistant-6112c.cloudfunctions.net/loadChat
https://us-central1-chat-assistant-6112c.cloudfunctions.net/listChats
https://us-central1-chat-assistant-6112c.cloudfunctions.net/deleteChat
https://us-central1-chat-assistant-6112c.cloudfunctions.net/health
```

## 🧪 Test Deployment

Test your health endpoint:
```bash
curl https://us-central1-chat-assistant-6112c.cloudfunctions.net/health
```

## 📊 Monitor Your App

- **Firebase Console**: https://console.firebase.google.com/project/chat-assistant-6112c
- **Function Logs**: `firebase functions:log`
- **Realtime Logs**: `firebase functions:log --follow`

## 🛠️ Common Commands

```bash
# Deploy only functions
npm run deploy:functions

# Deploy only hosting
npm run deploy:hosting

# Deploy only Firestore rules
npm run deploy:firestore

# View logs
firebase functions:log

# Check what will be deployed
firebase deploy --dry-run
```

## 🔄 Update After Changes

### Backend changes (functions/index.js):
```bash
firebase deploy --only functions
```

### Frontend changes:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

### Database rules (firestore.rules):
```bash
firebase deploy --only firestore:rules
```

## ❌ Rollback

If something goes wrong:
```bash
# List previous deployments
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

## 💡 Tips

1. **Free Tier Limits**: Firebase free tier includes:
   - 125K function invocations/month
   - 10GB hosting storage
   - 360MB/day bandwidth

2. **Cold Starts**: First request to a function may be slow (cold start). Subsequent requests are faster.

3. **CORS**: Already configured in functions. No action needed.

4. **Environment Variables**: All Firebase config must have `NEXT_PUBLIC_` prefix for Next.js.

## 🆘 Troubleshooting

### "Permission denied" error?
```bash
firebase login --reauth
```

### Functions not updating?
```bash
cd functions
rm -rf node_modules
npm install
cd ..
firebase deploy --only functions --force
```

### Frontend not showing updates?
- Clear browser cache
- Check `.env.local` file exists in frontend/
- Rebuild: `cd frontend && npm run build`

---

**Need help?** Check [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed documentation.
