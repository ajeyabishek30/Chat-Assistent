# Chat Assistant

A modern, feature-rich web-based chat assistant with a conversational user interface built with Next.js and Express.js. Features multiple chat support, sidebar navigation, theme customization, and a beautiful UI.

## Features

### Core Features [OK]
- [OK] Chat UI with message input and message display
- [OK] Users can send messages
- [OK] Assistant responds using rule-based replies
- [OK] Chat-style layout (User vs Assistant messages)
- [OK] Maintains conversation history on the page
- [OK] Handles empty input gracefully
- [OK] **Multiple Chat Support**: Create and manage multiple chat conversations
- [OK] **Chat History Sidebar**: Navigate between different chats easily
- [OK] **New Chat Functionality**: Start fresh conversations with one click

### UI/UX Features [UI]
- [OK] Loading/typing indicator with animated dots
- [OK] Fully responsive design (mobile, tablet, desktop)
- [OK] Chat history stored in localStorage
- [OK] Message timestamps displayed for each message
- [OK] Smooth animations for message appearance
- [OK] Beautiful gradient UI design
- [OK] **Custom Confirmation Modals**: Colorful, themed popups for actions
- [OK] **Account Modal**: User profile display with logout functionality
- [OK] **Mobile-Friendly Sidebar**: Hamburger menu for mobile navigation

### Advanced Features [ADVANCED]
- [OK] **Unit Testing**: Jest + React Testing Library
  - Backend test for empty message error handling
  - Frontend test for message appearing in DOM after send
- [OK] **Markdown Support**: Full markdown rendering with `react-markdown`
  - Inline code with syntax highlighting
  - Code blocks
  - Bold, italic, lists, and more
- [OK] **Theme System**: Three theme modes with CSS variables
  - Light mode (default)
  - Dark mode
  - Matrix mode (green/black cyberpunk theme)
  - System preference detection
  - Persistent theme selection
  - Smooth transitions
- [OK] **Accessibility (A11y)**: WCAG compliant
  - Proper ARIA labels and roles
  - Keyboard navigation (Enter to send)
  - High color contrast ratios
  - Screen reader support
  - Focus indicators
- [OK] **Auto-Scroll**: Smooth scroll to bottom on new messages
- [OK] **Message Editing**: Edit and regenerate responses
- [OK] **Chat Management**: Delete individual chats with confirmation
- [OK] **Settings Panel**: Theme switching and account management

## Tech Stack

- **Frontend**: Next.js 14 (React 18) with TypeScript
- **Backend**: Node.js & Express.js
- **Styling**: CSS Modules with responsive design and CSS variables
- **Storage**: localStorage for chat history persistence
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
│   ├── jest.config.js       # Jest configuration
│   ├── jest.setup.js        # Jest setup file
│   ├── package.json
│   └── next.config.js
├── backend/                  # Express.js backend API
│   ├── __tests__/           # Backend tests
│   │   └── server.test.js
│   ├── server.js            # Main server file
│   ├── jest.config.js       # Jest configuration
│   └── package.json
├── package.json             # Root package.json with scripts
├── vercel.json              # Vercel deployment configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

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
   
   Or install manually:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Running the Application

#### Development Mode (Recommended)

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
   - Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

### Backend (Railway/Heroku/Render)

1. **Railway/Heroku/Render:**
   - Connect GitHub repository
   - Set root directory to `backend`
   - Install command: `npm install`
   - Start command: `npm start`
   - Set PORT environment variable (usually auto-assigned)

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend (.env):**
```
PORT=5000
```

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

## License

MIT License

## Author

Built as part of an interview assessment task.

---

**Note**: Make sure to update the `NEXT_PUBLIC_API_URL` environment variable when deploying to production to point to your backend server URL.
