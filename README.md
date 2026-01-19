# Chat Assistant

A modern, feature-rich web-based chat assistant with a conversational user interface built with Next.js and Firebase. Features multiple chat support, persistent cloud storage, sidebar navigation, theme customization, and a beautiful UI.

## 🔥 Firebase Integration

This project now uses **Firebase** for:
- **Backend**: Firebase Cloud Functions (serverless)
- **Database**: Firestore (NoSQL cloud database)
- **Hosting**: Firebase Hosting (optional, can use Vercel)
- **Storage**: Persistent chat history across devices

## Features

### Core Features
- Chat UI with message input and message display
- Users can send messages
- Assistant responds using rule-based replies
- Chat-style layout (User vs Assistant messages)
- Maintains conversation history on the page
- Handles empty input gracefully
- **Multiple Chat Support**: Create and manage multiple chat conversations
- **Chat History Sidebar**: Navigate between different chats easily
- **New Chat Functionality**: Start fresh conversations with one click
- **Cloud Storage**: Chats saved to Firestore with localStorage fallback
- **Cross-Device Sync**: Access your chats from any device

### UI/UX Features
- Loading/typing indicator with animated dots
- Fully responsive design (mobile, tablet, desktop)
- Chat history stored in Firestore + localStorage
- Message timestamps displayed for each message
- Smooth animations for message appearance
- Beautiful gradient UI design
- **Custom Confirmation Modals**: Colorful, themed popups for actions
- **Account Modal**: User profile display with logout functionality
- **Mobile-Friendly Sidebar**: Hamburger menu for mobile navigation

### Advanced Features
- **Firebase Backend**: Serverless Cloud Functions
- **Firestore Database**: Scalable NoSQL database
- **Unit Testing**: Jest + React Testing Library
  - Backend test for empty message error handling
  - Frontend test for message appearing in DOM after send
- **Markdown Support**: Full markdown rendering with `react-markdown`
  - Inline code with syntax highlighting
  - Code blocks
  - Bold, italic, lists, and more
- **Theme System**: Three theme modes with CSS variables
  - Light mode (default)
  - Dark mode
  - Matrix mode (green/black cyberpunk theme)
  - System preference detection
  - Persistent theme selection
  - Smooth transitions
- **Accessibility (A11y)**: WCAG compliant
  - Proper ARIA labels and roles
  - Keyboard navigation (Enter to send)
  - High color contrast ratios
  - Screen reader support
  - Focus indicators
- **Auto-Scroll**: Smooth scroll to bottom on new messages
- **Message Editing**: Edit and regenerate responses
- **Chat Management**: Delete individual chats with confirmation
- **Settings Panel**: Theme switching and account management

## Tech Stack

- **Frontend**: Next.js 14 (React 18) with TypeScript
- **Backend**: Firebase Cloud Functions (Node.js)
- **Database**: Cloud Firestore (NoSQL)
- **Styling**: CSS Modules with responsive design and CSS variables
- **Storage**: Firestore + localStorage fallback for offline support
- **Hosting**: Firebase Hosting (or Vercel for frontend)
- **Testing**: Jest + React Testing Library + Supertest
- **Markdown**: react-markdown v9 for rich text rendering

## Project Structure

```
Chat-Assistant/
├── frontend/                 # Next.js frontend application
│   ├── app/
│   │   ├── components/      # React components
│   │   │   ├── ChatMessage.tsx          # Individual message component
│   │   │   ├── ChatInput.tsx            # Message input with send button
│   │   │   ├── TypingIndicator.tsx      # Loading animation
│   │   │   ├── ThemeToggle.tsx          # Theme switcher (legacy)
│   │   │   ├── Sidebar.tsx              # Chat history sidebar
│   │   │   ├── ConfirmationModal.tsx    # Custom confirmation dialogs
│   │   │   ├── AccountModal.tsx         # User account modal
│   │   │   └── SignInButton.tsx        # Sign in button component
│   │   ├── __tests__/       # Frontend tests
│   │   │   └── Chat.test.tsx
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main chat page with state management
│   │   └── globals.css      # Global styles with CSS variables
│   ├── lib/                 # Firebase & API utilities
│   │   ├── firebase.ts      # Firebase client configuration
│   │   └── api.ts           # API service layer
│   ├── .env.local           # Environment variables (Firebase config)
│   ├── .env.example         # Environment variables template
│   ├── jest.config.js       # Jest configuration
│   ├── jest.setup.js        # Jest setup file
│   ├── package.json
│   └── next.config.js
├── backend/                  # Express.js backend (legacy)
│   ├── __tests__/           # Backend tests
│   │   └── server.test.js
│   ├── server.js            # Main server file
│   ├── jest.config.js       # Jest configuration
│   └── package.json
├── functions/               # Firebase Cloud Functions (NEW)
│   ├── index.js            # Cloud Functions (chat, saveChat, etc.)
│   ├── package.json        # Functions dependencies
│   └── .eslintrc.js        # ESLint configuration
├── firebase.json           # Firebase configuration
├── .firebaserc            # Firebase project reference
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── package.json           # Root package.json with scripts
├── vercel.json            # Vercel deployment configuration
├── FIREBASE_SETUP.md      # Detailed Firebase setup guide
├── DEPLOY.md              # Quick deployment guide
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase CLI: `npm install -g firebase-tools`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Chat-Assistant
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   
   This will install dependencies for:
   - Root project
   - Backend (legacy Express server)
   - Frontend (Next.js)
   - Functions (Firebase Cloud Functions)

3. **Configure Firebase**
   
   Get your Firebase configuration from [Firebase Console](https://console.firebase.google.com/project/chat-assistant-6112c/settings/general):
   
   ```bash
   # Copy the example environment file
   cp frontend/.env.example frontend/.env.local
   
   # Edit frontend/.env.local and add your Firebase config
   ```

### Running the Application

#### Option 1: Firebase (Recommended for Production)

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Deploy to Firebase**
   ```bash
   npm run deploy:all
   ```
   
   Your app will be live at: `https://chat-assistant-6112c.web.app`

#### Option 2: Local Development with Firebase Emulators

```bash
# Terminal 1: Start Firebase emulators
npm run emulators:start

# Terminal 2: Start frontend
cd frontend
npm run dev
```

This will start:
- Firebase Emulators on various ports
- Frontend development server on `http://localhost:3000`

#### Option 3: Development Mode (Legacy Backend)

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Run Separately

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

### Production Build

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

## User Interface

### Sidebar Features

- **New Chat Button**: Create a new conversation instantly
- **Chat History**: View and navigate between all your conversations
- **Chat Titles**: Automatically generated from the first user message
- **Delete Chats**: Remove individual chats with confirmation
- **Settings Panel**: 
  - Theme switching (Light/Dark/Matrix)
  - Account management
- **Mobile Support**: Collapsible sidebar with hamburger menu

### Chat Features

- **Message Editing**: Edit your last message and regenerate the response
- **Clear Chat**: Reset current conversation with confirmation
- **Markdown Rendering**: Rich text support for code, lists, and formatting
- **Auto-scroll**: Automatically scrolls to latest messages
- **Timestamps**: See when each message was sent

### Modals & Dialogs

- **Confirmation Modals**: Beautiful, themed popups for:
  - Clearing chat (warning style)
  - Deleting chat (danger style)
- **Account Modal**: View user information and logout
- **Smooth Animations**: Fade-in overlays and slide-up modals

## Approach & Logic

### Frontend Architecture

1. **Component Structure**
   - `page.tsx`: Main chat container managing state, multiple chats, and API calls
   - `Sidebar.tsx`: Chat history navigation and settings
   - `ChatMessage.tsx`: Individual message component with user/assistant styling and markdown support
   - `ChatInput.tsx`: Input field with send button and keyboard handling
   - `TypingIndicator.tsx`: Animated loading indicator
   - `ConfirmationModal.tsx`: Reusable confirmation dialogs
   - `AccountModal.tsx`: User account information and logout

2. **State Management**
   - Uses React hooks (`useState`, `useEffect`) for local state
   - Multiple chats stored in localStorage with unique IDs
   - Current chat tracked by ID
   - Messages synchronized with localStorage per chat
   - Auto-scrolls to bottom when new messages arrive

3. **Persistence**
   - Chat history automatically saved to localStorage
   - Each chat stored separately with metadata (title, timestamps)
   - History restored on page reload
   - Clear button to reset current conversation
   - Delete button to remove individual chats

4. **User Experience**
   - Empty input validation (prevents sending empty messages)
   - Loading states with typing indicator
   - Smooth animations for message appearance
   - Responsive design for all screen sizes
   - Timestamps on all messages
   - Custom modals instead of browser alerts
   - Mobile-optimized sidebar with overlay

### Backend Architecture

1. **API Endpoints**
   - `POST /api/chat`: Main chat endpoint that processes user messages
   - `GET /api/health`: Health check endpoint

2. **Rule-Based Response Logic**
   The assistant uses pattern matching to provide contextual responses:
   - **Greetings**: Recognizes various greeting patterns
   - **Goodbyes**: Handles farewell messages
   - **Questions**: Responds to what/who/where/when/why/how questions
   - **Time/Date**: Provides current time and date
   - **Help**: Offers assistance information
   - **Default**: Random contextual responses for unmatched patterns

3. **Response Timing**
   - Simulates natural conversation with random delay (500-1500ms)
   - Provides better UX than instant responses

4. **Error Handling**
   - Validates empty messages
   - Returns appropriate error responses
   - Handles edge cases gracefully

### Design Decisions

1. **Next.js App Router**: Used modern Next.js 14 with App Router for better performance and developer experience
2. **TypeScript**: Type safety for better code quality and maintainability
3. **CSS Modules**: Scoped styling to prevent conflicts
4. **CSS Variables**: Used for theme switching (light/dark/matrix) with smooth transitions
5. **localStorage**: Simple client-side persistence without database complexity
6. **Multiple Chat Support**: Each chat stored separately for better organization
7. **Custom Modals**: Replaced browser alerts with styled, themed modals
8. **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
9. **Animations**: Subtle animations enhance UX without being distracting
10. **Accessibility First**: WCAG compliant with proper ARIA labels, keyboard navigation, and high contrast ratios
11. **Markdown Support**: Rich text rendering for better user experience with code examples
12. **Testing**: Unit tests for critical functionality to ensure reliability

## Deployment

### Frontend (Vercel)

The project is configured for Vercel deployment with `vercel.json`:

1. **Vercel Setup:**
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `.next`
## Deployment

### Firebase Deployment (Recommended)

Full Firebase deployment with Cloud Functions, Firestore, and Hosting:

```bash
# Deploy everything
npm run deploy:all
```

Or deploy components separately:

```bash
# Deploy backend functions
npm run deploy:functions

# Deploy Firestore rules and indexes
npm run deploy:firestore

# Build and deploy frontend hosting
npm run deploy:hosting
```

**Your app will be live at:**
- https://chat-assistant-6112c.web.app
- https://chat-assistant-6112c.firebaseapp.com

See [DEPLOY.md](./DEPLOY.md) for quick deployment guide or [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed documentation.

### Vercel + Firebase (Hybrid)

Deploy frontend to Vercel while using Firebase for backend:

1. **Deploy Firebase Functions:**
   ```bash
   firebase deploy --only functions,firestore
   ```

2. **Deploy Frontend to Vercel:**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables in Vercel:**
   - Add all variables from `frontend/.env.example`
   - `NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL` should point to your deployed functions

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=chat-assistant-6112c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=chat-assistant-6112c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=chat-assistant-6112c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-chat-assistant-6112c.cloudfunctions.net
```

Get these values from [Firebase Console](https://console.firebase.google.com/project/chat-assistant-6112c/settings/general).

## Testing

### Running Tests

**Frontend tests:**
```bash
cd frontend
npm test
```

**Backend tests:**
```bash
cd backend
npm test
```

**Watch mode (for development):**
```bash
cd frontend
npm run test:watch
```

### Test Coverage

- **Backend**: Tests for empty message error handling, valid message responses, and health check endpoint
- **Frontend**: Tests for message rendering, Enter key submission, and empty input validation

### Manual Testing

1. Start the application: `npm run dev`
2. Open `http://localhost:3000` in your browser
3. **Test Chat Features:**
   - Click "New Chat" to create multiple conversations
   - Send messages in different chats
   - Switch between chats using the sidebar
   - Delete a chat and confirm deletion
   - Clear current chat and confirm
4. **Test Messages:**
   - "Hello"
   - "How are you?"
   - "What time is it?"
   - "Help"
   - "Thank you"
   - "Goodbye"
   - Try markdown: "Try `npm install` to install packages"
   - Try **bold** and *italic* text
5. **Test UI Features:**
   - Toggle themes in Settings (Light/Dark/Matrix)
   - Open Account modal and view user info
   - Test logout functionality
   - Test mobile responsive design (resize browser)
   - Test hamburger menu on mobile view
   - Test keyboard navigation (Enter to send, Escape to cancel edit)

## API Documentation

### POST /api/chat

Send a message to the chat assistant.

**Request:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "response": "Hello! How can I assist you today?",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Message cannot be empty",
  "response": "Please enter a message to continue our conversation."
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Chat Assistant API is running"
}
```

## Key Features Explained

### Multiple Chat Support

- Each chat conversation is stored separately in localStorage
- Chat titles are automatically generated from the first user message
- Users can create unlimited chats and switch between them
- Chats are sorted by most recent activity

### Theme System

- **Light Mode**: Clean, bright interface perfect for daytime use
- **Dark Mode**: Modern dark theme for reduced eye strain
- **Matrix Mode**: Cyberpunk-inspired green/black theme
- Themes persist across sessions
- System preference detection on first load

### Custom Modals

- Replaced browser `confirm()` dialogs with styled modals
- Warning style for clearing chats (orange/yellow)
- Danger style for deleting chats (red)
- Smooth animations and backdrop blur
- Click outside to cancel

### Mobile Responsiveness

- Sidebar collapses on mobile devices
- Hamburger menu button in header
- Overlay when sidebar is open
- Touch-friendly buttons and interactions
- Responsive modal sizing

## Future Enhancements

Potential improvements for production:
- User authentication and user accounts
- Database integration for chat history (instead of localStorage)
- WebSocket support for real-time communication
- Integration with AI/ML models (OpenAI, Anthropic, etc.) for smarter responses
- Multi-language support
- File upload capabilities (images, documents)
- Message search functionality
- Export chat history (PDF, JSON)
- Share chat conversations
- Voice input/output
- Chat templates and presets


