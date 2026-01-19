# Chat Assistant - Firebase Migration

This project has been migrated to use Firebase for backend and database functionality.

## 🔥 Firebase Setup

### Prerequisites
1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

### Project Structure
```
├── functions/              # Firebase Cloud Functions (Backend)
│   ├── index.js           # Main functions code
│   └── package.json       # Functions dependencies
├── frontend/              # Next.js Frontend
│   ├── lib/
│   │   ├── firebase.ts    # Firebase client config
│   │   └── api.ts         # API service layer
│   └── app/
│       └── page.tsx       # Main chat interface
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── firebase.json          # Firebase configuration
└── .firebaserc           # Firebase project reference
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables

Get your Firebase configuration from [Firebase Console](https://console.firebase.google.com/):
- Go to Project Settings > General
- Scroll to "Your apps" section
- Copy the config values

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=chat-assistant-6112c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=chat-assistant-6112c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=chat-assistant-6112c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-chat-assistant-6112c.cloudfunctions.net
```

### 3. Initialize Functions
```bash
cd functions
npm install
cd ..
```

### 4. Deploy to Firebase

#### Deploy Everything:
```bash
npm run deploy:all
```

#### Or deploy individually:

**Deploy Functions:**
```bash
npm run deploy:functions
```

**Deploy Firestore Rules:**
```bash
npm run deploy:firestore
```

**Deploy Frontend (Hosting):**
```bash
npm run deploy:hosting
```

### 5. Test Locally with Emulators

Start Firebase emulators for local development:
```bash
npm run emulators:start
```

This will start:
- Functions emulator (port 5001)
- Firestore emulator (port 8080)
- Hosting emulator (port 5000)

Update `frontend/.env.local` to point to emulators:
```env
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=http://localhost:5001/chat-assistant-6112c/us-central1
```

## 📡 Firebase Functions (Backend API)

The following Cloud Functions are available:

### `/chat` - Send Chat Message
```bash
POST https://us-central1-chat-assistant-6112c.cloudfunctions.net/chat
Content-Type: application/json

{
  "message": "Hello!"
}
```

### `/saveChat` - Save Chat to Firestore
```bash
POST https://us-central1-chat-assistant-6112c.cloudfunctions.net/saveChat
Content-Type: application/json

{
  "chatId": "optional-existing-id",
  "title": "Chat Title",
  "messages": [...],
  "sessionId": "session_id"
}
```

### `/loadChat` - Load Chat from Firestore
```bash
GET https://us-central1-chat-assistant-6112c.cloudfunctions.net/loadChat?chatId=CHAT_ID
```

### `/listChats` - List All Chats
```bash
GET https://us-central1-chat-assistant-6112c.cloudfunctions.net/listChats?sessionId=SESSION_ID
```

### `/deleteChat` - Delete Chat
```bash
POST https://us-central1-chat-assistant-6112c.cloudfunctions.net/deleteChat
Content-Type: application/json

{
  "chatId": "chat_id_to_delete"
}
```

### `/health` - Health Check
```bash
GET https://us-central1-chat-assistant-6112c.cloudfunctions.net/health
```

## 🗄️ Database Structure (Firestore)

### Collections

#### `chats`
```javascript
{
  chatId: {
    title: string,
    messages: [
      {
        id: string,
        text: string,
        sender: 'user' | 'assistant',
        timestamp: Date
      }
    ],
    createdAt: Timestamp,
    updatedAt: Timestamp,
    userId: string | null,
    sessionId: string | null
  }
}
```

## 🔐 Security

- Firestore security rules are defined in `firestore.rules`
- Anonymous users can store chats using session IDs
- User authentication can be added later for persistent accounts

## 🌐 Deployment Options

### Option 1: Firebase Hosting + Functions (Recommended)
- Frontend: Firebase Hosting
- Backend: Firebase Functions
- Database: Firestore

```bash
npm run deploy:all
```

Your app will be available at:
- https://chat-assistant-6112c.web.app
- https://chat-assistant-6112c.firebaseapp.com

### Option 2: Vercel Frontend + Firebase Backend
- Frontend: Deploy to Vercel
- Backend: Firebase Functions
- Database: Firestore

1. Deploy functions:
   ```bash
   npm run deploy:functions
   npm run deploy:firestore
   ```

2. Deploy frontend to Vercel:
   ```bash
   cd frontend
   vercel
   ```

3. Add environment variables in Vercel dashboard

## 📊 Monitoring

View logs and monitor your Firebase project:
```bash
# View function logs
firebase functions:log

# View realtime logs
firebase functions:log --follow
```

Or visit: https://console.firebase.google.com/project/chat-assistant-6112c

## 🔄 Migration Notes

### Changes from Original Setup:
1. **Backend**: Moved from Express.js to Firebase Cloud Functions
2. **Database**: Chats now stored in Firestore (with localStorage fallback)
3. **Storage**: Persistent storage across devices using Firebase
4. **Deployment**: Single command deployment with Firebase CLI

### Backwards Compatibility:
- LocalStorage still works as a fallback
- Same chat functionality and UI
- Existing chats in localStorage will be preserved

## 🛠️ Development

### Local Development:
```bash
# Terminal 1: Start frontend
cd frontend
npm run dev

# Terminal 2: Start Firebase emulators
npm run emulators:start
```

### Production:
```bash
npm run deploy:all
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain | `chat-assistant-6112c.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID | `chat-assistant-6112c` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket | `chat-assistant-6112c.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | `1:123:web:abc` |
| `NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL` | Functions URL | `https://us-central1-chat-assistant-6112c.cloudfunctions.net` |

## 🐛 Troubleshooting

### Functions not deploying?
```bash
# Check Firebase login
firebase login --reauth

# Check project
firebase use chat-assistant-6112c

# Reinstall dependencies
cd functions
rm -rf node_modules package-lock.json
npm install
cd ..
firebase deploy --only functions
```

### CORS errors?
- CORS is configured in `functions/index.js`
- Add your domain to allowed origins if needed

### Firestore permission denied?
- Check `firestore.rules`
- Deploy rules: `npm run deploy:firestore`

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎯 Next Steps

1. Add user authentication (Firebase Auth)
2. Implement real-time chat updates using Firestore listeners
3. Add file upload capabilities (Firebase Storage)
4. Integrate AI models (OpenAI, Gemini, etc.)
5. Add analytics (Firebase Analytics)

---

**Project ID**: `chat-assistant-6112c`
**Region**: `us-central1`
**Framework**: Next.js + Firebase
